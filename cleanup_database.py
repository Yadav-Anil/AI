#!/usr/bin/env python3
"""
Database cleanup script for TaskFlow
Removes all user data from MongoDB collections
"""

import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def cleanup_database():
    """Clean up all user data from the database."""
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🧹 Starting database cleanup...")
    
    try:
        # List all collections to clean
        collections_to_clean = [
            'users',
            'categories', 
            'tasks',
            'password_resets',
            'status_checks'  # Also clean the old status checks from template
        ]
        
        cleanup_results = {}
        
        for collection_name in collections_to_clean:
            collection = db[collection_name]
            
            # Count documents before cleanup
            before_count = await collection.count_documents({})
            
            if before_count > 0:
                # Delete all documents
                result = await collection.delete_many({})
                cleanup_results[collection_name] = {
                    'before': before_count,
                    'deleted': result.deleted_count
                }
                print(f"✅ {collection_name}: Deleted {result.deleted_count} documents")
            else:
                cleanup_results[collection_name] = {
                    'before': 0,
                    'deleted': 0
                }
                print(f"📭 {collection_name}: Already empty")
        
        # Verify cleanup
        print("\n🔍 Verifying cleanup...")
        total_remaining = 0
        
        for collection_name in collections_to_clean:
            remaining = await db[collection_name].count_documents({})
            total_remaining += remaining
            if remaining == 0:
                print(f"✅ {collection_name}: Clean (0 documents)")
            else:
                print(f"⚠️ {collection_name}: {remaining} documents remaining")
        
        if total_remaining == 0:
            print("\n🎉 Database cleanup completed successfully!")
            print("📊 Cleanup Summary:")
            for collection, stats in cleanup_results.items():
                if stats['deleted'] > 0:
                    print(f"  • {collection}: {stats['deleted']} documents removed")
        else:
            print(f"\n⚠️ Warning: {total_remaining} documents still remain in database")
            
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        return False
    finally:
        client.close()
    
    return total_remaining == 0

if __name__ == "__main__":
    success = asyncio.run(cleanup_database())
    if success:
        print("\n✨ Database is now clean and ready for fresh data!")
    else:
        print("\n💥 Cleanup failed or incomplete!")