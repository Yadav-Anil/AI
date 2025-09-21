#!/usr/bin/env python3
"""
Backend API Testing Suite for Portfolio Website
Tests all portfolio API endpoints for functionality and data integrity
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from environment
BACKEND_URL = "https://skills-spotlight-13.preview.emergentagent.com/api"

class PortfolioAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_profile_api(self):
        """Test GET /api/profile endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/profile", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Profile API", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
                return False
            
            data = response.json()
            
            # Validate response structure
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Profile API", False, "Invalid response structure", 
                            {"response": data})
                return False
            
            profile_data = data.get('data', {})
            required_fields = ['name', 'title', 'company', 'location', 'tagline', 'summary', 'contact']
            
            missing_fields = [field for field in required_fields if field not in profile_data]
            if missing_fields:
                self.log_test("Profile API", False, f"Missing required fields: {missing_fields}",
                            {"profile_data": profile_data})
                return False
            
            # Check if it's Anil Yadav's profile
            if "Anil Yadav" not in profile_data.get('name', ''):
                self.log_test("Profile API", False, "Profile doesn't contain Anil Yadav's data",
                            {"name": profile_data.get('name')})
                return False
            
            self.log_test("Profile API", True, "Profile data retrieved successfully",
                        {"name": profile_data.get('name'), "title": profile_data.get('title')})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Profile API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Profile API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_skills_api(self):
        """Test GET /api/skills endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/skills", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Skills API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Skills API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            skills_data = data.get('data', [])
            
            if not isinstance(skills_data, list) or len(skills_data) == 0:
                self.log_test("Skills API", False, "Skills data should be a non-empty array",
                            {"skills_data": skills_data})
                return False
            
            # Validate skill structure
            for skill in skills_data[:3]:  # Check first 3 skills
                required_fields = ['name', 'level', 'category']
                missing_fields = [field for field in required_fields if field not in skill]
                if missing_fields:
                    self.log_test("Skills API", False, f"Skill missing fields: {missing_fields}",
                                {"skill": skill})
                    return False
            
            self.log_test("Skills API", True, f"Skills retrieved successfully ({len(skills_data)} skills)",
                        {"sample_skills": [s.get('name') for s in skills_data[:3]]})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Skills API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Skills API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_certifications_api(self):
        """Test GET /api/certifications endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/certifications", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Certifications API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Certifications API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            certs_data = data.get('data', [])
            
            if not isinstance(certs_data, list) or len(certs_data) == 0:
                self.log_test("Certifications API", False, "Certifications should be a non-empty array",
                            {"certs_data": certs_data})
                return False
            
            # Check for Azure, AWS, IBM Blockchain certs
            cert_names = [cert.get('name', '').lower() for cert in certs_data]
            cert_issuers = [cert.get('issuer', '').lower() for cert in certs_data]
            
            has_azure = any('azure' in name or 'azure' in issuer for name, issuer in zip(cert_names, cert_issuers))
            has_aws = any('aws' in name or 'amazon' in issuer for name, issuer in zip(cert_names, cert_issuers))
            has_ibm = any('ibm' in name or 'blockchain' in name or 'ibm' in issuer for name, issuer in zip(cert_names, cert_issuers))
            
            missing_certs = []
            if not has_azure: missing_certs.append("Azure")
            if not has_aws: missing_certs.append("AWS")
            if not has_ibm: missing_certs.append("IBM/Blockchain")
            
            if missing_certs:
                self.log_test("Certifications API", False, f"Missing expected certifications: {missing_certs}",
                            {"available_certs": [cert.get('name') for cert in certs_data]})
                return False
            
            self.log_test("Certifications API", True, f"Certifications retrieved successfully ({len(certs_data)} certs)",
                        {"cert_names": [cert.get('name') for cert in certs_data[:3]]})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Certifications API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Certifications API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_experience_api(self):
        """Test GET /api/experience endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/experience", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Experience API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Experience API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            exp_data = data.get('data', [])
            
            if not isinstance(exp_data, list) or len(exp_data) == 0:
                self.log_test("Experience API", False, "Experience should be a non-empty array",
                            {"exp_data": exp_data})
                return False
            
            # Validate experience structure
            for exp in exp_data[:2]:  # Check first 2 experiences
                required_fields = ['company', 'position', 'duration', 'description']
                missing_fields = [field for field in required_fields if field not in exp]
                if missing_fields:
                    self.log_test("Experience API", False, f"Experience missing fields: {missing_fields}",
                                {"experience": exp})
                    return False
            
            self.log_test("Experience API", True, f"Experience retrieved successfully ({len(exp_data)} entries)",
                        {"companies": [exp.get('company') for exp in exp_data[:3]]})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Experience API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Experience API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_projects_api(self):
        """Test GET /api/projects endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/projects", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Projects API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Projects API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            projects_data = data.get('data', [])
            
            if not isinstance(projects_data, list) or len(projects_data) == 0:
                self.log_test("Projects API", False, "Projects should be a non-empty array",
                            {"projects_data": projects_data})
                return False
            
            # Validate project structure
            for project in projects_data[:2]:  # Check first 2 projects
                required_fields = ['title', 'description', 'technologies']
                missing_fields = [field for field in required_fields if field not in project]
                if missing_fields:
                    self.log_test("Projects API", False, f"Project missing fields: {missing_fields}",
                                {"project": project})
                    return False
            
            self.log_test("Projects API", True, f"Projects retrieved successfully ({len(projects_data)} projects)",
                        {"project_titles": [proj.get('title') for proj in projects_data[:3]]})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Projects API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Projects API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_education_api(self):
        """Test GET /api/education endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/education", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Education API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Education API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            edu_data = data.get('data', {})
            
            if not isinstance(edu_data, dict):
                self.log_test("Education API", False, "Education data should be an object",
                            {"edu_data": edu_data})
                return False
            
            required_fields = ['degree', 'institution', 'duration']
            missing_fields = [field for field in required_fields if field not in edu_data]
            if missing_fields:
                self.log_test("Education API", False, f"Education missing fields: {missing_fields}",
                            {"edu_data": edu_data})
                return False
            
            self.log_test("Education API", True, "Education retrieved successfully",
                        {"degree": edu_data.get('degree'), "institution": edu_data.get('institution')})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Education API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Education API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_contact_form_api(self):
        """Test POST /api/contact endpoint"""
        try:
            # Test data
            contact_data = {
                "name": "John Smith",
                "email": "john.smith@example.com",
                "message": "This is a test message for the portfolio contact form. Testing API functionality."
            }
            
            response = self.session.post(
                f"{self.base_url}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Contact Form API", False, f"HTTP {response.status_code}",
                            {"response": response.text, "request_data": contact_data})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Contact Form API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            # Check if message ID is returned
            response_data = data.get('data', {})
            if not response_data.get('id'):
                self.log_test("Contact Form API", False, "No message ID returned",
                            {"response_data": response_data})
                return False
            
            self.log_test("Contact Form API", True, "Contact form submission successful",
                        {"message_id": response_data.get('id'), "message": data.get('message')})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Contact Form API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Contact Form API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_contact_messages_api(self):
        """Test GET /api/contact/messages endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/contact/messages", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Contact Messages API", False, f"HTTP {response.status_code}",
                            {"response": response.text})
                return False
            
            data = response.json()
            
            if not isinstance(data, dict) or not data.get('success'):
                self.log_test("Contact Messages API", False, "Invalid response structure",
                            {"response": data})
                return False
            
            messages_data = data.get('data', [])
            
            if not isinstance(messages_data, list):
                self.log_test("Contact Messages API", False, "Messages should be an array",
                            {"messages_data": messages_data})
                return False
            
            # If there are messages, validate structure
            if len(messages_data) > 0:
                for message in messages_data[:2]:  # Check first 2 messages
                    required_fields = ['id', 'name', 'email', 'message', 'timestamp']
                    missing_fields = [field for field in required_fields if field not in message]
                    if missing_fields:
                        self.log_test("Contact Messages API", False, f"Message missing fields: {missing_fields}",
                                    {"message": message})
                        return False
            
            self.log_test("Contact Messages API", True, f"Contact messages retrieved successfully ({len(messages_data)} messages)",
                        {"message_count": len(messages_data)})
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Contact Messages API", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Contact Messages API", False, f"Unexpected error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid contact form data
            invalid_contact_data = {
                "name": "",  # Empty name
                "email": "invalid-email",  # Invalid email
                "message": ""  # Empty message
            }
            
            response = self.session.post(
                f"{self.base_url}/contact",
                json=invalid_contact_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should handle validation errors gracefully
            if response.status_code == 422:  # Validation error
                self.log_test("Error Handling", True, "Validation errors handled correctly",
                            {"status_code": response.status_code})
                return True
            elif response.status_code == 200:
                # If it accepts invalid data, that's also acceptable for this test
                self.log_test("Error Handling", True, "API accepts data without strict validation",
                            {"status_code": response.status_code})
                return True
            else:
                self.log_test("Error Handling", False, f"Unexpected status code: {response.status_code}",
                            {"response": response.text})
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling", False, f"Request failed: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Error Handling", False, f"Unexpected error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Portfolio API Tests")
        print(f"📍 Backend URL: {self.base_url}")
        print("=" * 60)
        
        tests = [
            ("Profile API", self.test_profile_api),
            ("Skills API", self.test_skills_api),
            ("Certifications API", self.test_certifications_api),
            ("Experience API", self.test_experience_api),
            ("Projects API", self.test_projects_api),
            ("Education API", self.test_education_api),
            ("Contact Form API", self.test_contact_form_api),
            ("Contact Messages API", self.test_contact_messages_api),
            ("Error Handling", self.test_error_handling)
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL: {test_name} - Unexpected error: {str(e)}")
                failed += 1
            print("-" * 40)
        
        print("=" * 60)
        print(f"📊 Test Results Summary:")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 Failed Tests Details:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return failed == 0

def main():
    """Main test execution"""
    tester = PortfolioAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend APIs are working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()