#!/usr/bin/env python3
"""
Database seeding script for portfolio data
"""
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

# Portfolio data to seed
PROFILE_DATA = {
    "name": "Anil Yadav",
    "title": "Senior Technical Lead & Cloud Infrastructure Consultant",
    "company": "Nucleus Software Japan K.K.",
    "location": "Tokyo, Japan",
    "tagline": "16+ years building cloud infrastructure & AI-powered solutions | Open for consulting | Japan PR holder",
    "summary": "Senior Technical Lead with 16+ years of expertise in cloud infrastructure, AI-based software solutions, and enterprise architecture. Specialized in helping companies in India and Tokyo scale their cloud operations and implement cutting-edge AI technologies. Currently available for consulting projects with no visa restrictions (Japan Permanent Resident).",
    "profileImage": "https://customer-assets.emergentagent.com/job_skills-spotlight-13/artifacts/4d83nfbn_Gemini_Generated_Image_fdcysfdcysfdcysf.png",
    "consulting": {
        "available": True,
        "specializations": ["Cloud Infrastructure", "AI-based Software", "Enterprise Architecture", "System Migration"],
        "targetMarkets": ["India", "Tokyo", "Japan"],
        "visaStatus": "Japan Permanent Resident - No visa sponsorship required"
    },
    "contact": {
        "email": "anilyadav83@gmail.com",
        "linkedin": "www.linkedin.com/in/anil-yadav-a1223211",
        "blogs": [
            {"name": "SQL Server Team Blog", "url": "sqlserverteam.blogspot.com/"},
            {"name": "Personal Tech Blog", "url": "anil83.blogspot.com/"}
        ]
    }
}

SKILLS_DATA = {
    "skills": [
        {"name": "Microsoft Azure", "level": 95, "category": "Cloud"},
        {"name": "AWS", "level": 90, "category": "Cloud"},
        {"name": "Google Cloud Platform", "level": 85, "category": "Cloud"},
        {"name": "Kubernetes", "level": 90, "category": "Cloud"},
        {"name": "Docker", "level": 92, "category": "Cloud"},
        {"name": "Machine Learning", "level": 85, "category": "AI"},
        {"name": "TensorFlow", "level": 80, "category": "AI"},
        {"name": "AI Architecture", "level": 88, "category": "AI"},
        {"name": "Web Services", "level": 95, "category": "Backend"},
        {"name": "WCF", "level": 90, "category": "Framework"},
        {"name": "Oracle Database", "level": 95, "category": "Database"},
        {"name": "PL/SQL", "level": 92, "category": "Database"},
        {"name": "Requirements Analysis", "level": 95, "category": "Analysis"},
        {"name": "Agile Methodologies", "level": 90, "category": "Process"},
        {"name": "SDLC", "level": 95, "category": "Process"},
        {"name": "Enterprise Architecture", "level": 93, "category": "Architecture"},
        {"name": "System Migration", "level": 90, "category": "Architecture"},
        {"name": "Blockchain", "level": 75, "category": "Emerging Tech"}
    ]
}

CERTIFICATIONS_DATA = {
    "certifications": [
        {
            "id": 1,
            "name": "Microsoft Azure: Design and Implement a Storage Strategy",
            "issuer": "Microsoft",
            "year": "2023",
            "type": "Cloud Architecture"
        },
        {
            "id": 2,
            "name": "AWS Certified Solutions Architect – Associate",
            "issuer": "Amazon Web Services",
            "year": "2023",
            "type": "Cloud Architecture"
        },
        {
            "id": 3,
            "name": "IBM Blockchain Essentials",
            "issuer": "IBM",
            "year": "2022",
            "type": "Blockchain Technology"
        },
        {
            "id": 4,
            "name": "Become a Cloud Developer",
            "issuer": "Professional Certification",
            "year": "2023",
            "type": "Cloud Development"
        }
    ]
}

EXPERIENCE_DATA = {
    "experience": [
        {
            "id": 1,
            "company": "Nucleus Software Japan K.K.",
            "position": "Senior Technical Lead",
            "duration": "April 2014 - Present",
            "period": "11+ years",
            "description": "Leading technical initiatives and architecture decisions for IBU - NOZOMI for Shinsei Bank, Japan. Responsible for system design, team leadership, and project delivery.",
            "technologies": ["Web Services", "Oracle Database", "PL/SQL", "Agile", "System Architecture"]
        },
        {
            "id": 2,
            "company": "Nucleus Software Japan K.K.",
            "position": "System Analyst",
            "duration": "April 2012 - March 2014",
            "period": "2 years",
            "description": "Analyzed business requirements and designed technical solutions for banking systems. Collaborated with stakeholders to ensure optimal system performance.",
            "technologies": ["Requirements Analysis", "System Design", "Database Optimization"]
        },
        {
            "id": 3,
            "company": "Nucleus Software Japan K.K.",
            "position": "Senior Software Engineer",
            "duration": "March 2009 - April 2012",
            "period": "3+ years",
            "description": "Developed and maintained software solutions for financial institutions. Focused on web services development and database integration.",
            "technologies": ["Web Development", "Database Integration", "Software Engineering"]
        },
        {
            "id": 4,
            "company": "Advantage Learning Systems India Pvt Ltd",
            "position": "Application Programmer",
            "duration": "August 2006 - March 2009",
            "period": "2+ years",
            "description": "Worked on educational technology solutions as part of Renaissance Learning Inc. subsidiary. Developed computer-based assessment technology for pre-K-12 schools.",
            "technologies": ["Application Development", "Educational Technology", "Assessment Systems"]
        },
        {
            "id": 5,
            "company": "Sugal & Damani Enterprises Pvt. Ltd.",
            "position": "Software Engineer",
            "duration": "November 2004 - August 2006",
            "period": "1+ years",
            "description": "Developed customized software solutions in web-based technologies, database systems, and client-server architecture for various business domains.",
            "technologies": ["Web Technologies", "Database Systems", "Client-Server Architecture"]
        }
    ]
}

PROJECTS_DATA = {
    "projects": [
        {
            "id": 1,
            "title": "Banking System Architecture - NOZOMI",
            "description": "Led the architectural design and implementation of core banking solutions for Shinsei Bank, Japan. Implemented scalable web services and optimized database performance.",
            "technologies": ["Web Services", "Oracle Database", "PL/SQL", "System Architecture"],
            "status": "Production",
            "impact": "Serving millions of banking transactions daily"
        },
        {
            "id": 2,
            "title": "Cloud Migration Strategy",
            "description": "Designed and executed cloud migration strategies for legacy banking systems, leveraging Azure and AWS cloud platforms for improved scalability and reliability.",
            "technologies": ["Microsoft Azure", "AWS", "Cloud Architecture", "Migration Planning"],
            "status": "Completed",
            "impact": "40% improvement in system performance"
        },
        {
            "id": 3,
            "title": "Educational Assessment Platform",
            "description": "Developed computer-based assessment technology for Renaissance Learning, serving over 75,000 North American schools with personalized learning solutions.",
            "technologies": ["Assessment Systems", "Educational Technology", "Scalable Architecture"],
            "status": "Completed",
            "impact": "Used by 75,000+ schools across North America"
        },
        {
            "id": 4,
            "title": "Enterprise Web Services Framework",
            "description": "Built a comprehensive web services framework using WCF and XML technologies, enabling seamless integration between multiple enterprise systems.",
            "technologies": ["WCF", "XML", "Web Services", "Enterprise Integration"],
            "status": "Production",
            "impact": "Reduced integration time by 60%"
        }
    ]
}

EDUCATION_DATA = {
    "degree": "B.Tech in Information Technology",
    "institution": "UP Technical University, Lucknow, India",
    "duration": "2000 - 2004",
    "description": "Comprehensive study of information technology fundamentals, software engineering principles, and database management systems."
}

async def seed_database():
    """Seed the database with portfolio data"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("Starting database seeding...")
        
        # Clear existing data
        await db.profiles.delete_many({})
        await db.skills.delete_many({})
        await db.certifications.delete_many({})
        await db.experience.delete_many({})
        await db.projects.delete_many({})
        await db.education.delete_many({})
        
        print("Cleared existing data")
        
        # Insert new data
        await db.profiles.insert_one(PROFILE_DATA)
        print("✓ Profile data inserted")
        
        await db.skills.insert_one(SKILLS_DATA)
        print("✓ Skills data inserted")
        
        await db.certifications.insert_one(CERTIFICATIONS_DATA)
        print("✓ Certifications data inserted")
        
        await db.experience.insert_one(EXPERIENCE_DATA)
        print("✓ Experience data inserted")
        
        await db.projects.insert_one(PROJECTS_DATA)
        print("✓ Projects data inserted")
        
        await db.education.insert_one(EDUCATION_DATA)
        print("✓ Education data inserted")
        
        print("\n🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())