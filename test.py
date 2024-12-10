import requests

# Define the URL for the POST request
url = "http://crazzyfour.up.railway.app/api/v1/auth/signup"  # Replace with the actual endpoint

# Define the payload
payload = {
    "email": "abhi@example.com",
    "password": "password"
}

# Define the headers (if needed)
headers = {
    "Content-Type": "application/json"
}

# Send the POST request
try:
    response = requests.post(url, json=payload, headers=headers)
    
    # Check the status code and print the response
    if response.status_code == 200:
        print("Request was successful!")
        print("Response:", response.json())  # If the response is in JSON format
    else:
        print(f"Request failed with status code: {response.status_code}")
        print("Response:", response.text)
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
