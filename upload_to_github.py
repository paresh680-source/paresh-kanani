import os
import base64
import json
import urllib.request
import urllib.error

print("====================================================")
print("પરેશ કાનાણી ફોટોગ્રાફી - GitHub અપલોડર સ્ક્રિપ્ટ")
print("====================================================")

# Request Personal Access Token (PAT)
token = input("કૃપા કરીને તમારો GitHub Personal Access Token (PAT) દાખલ કરો: ").strip()
if not token:
    print("ભૂલ: ટોકન જરૂરી છે!")
    input("પૂર્ણ કરવા માટે Enter દબાવો...")
    exit(1)

owner = "paresh680-source"
repo = "paresh-kanani"

# Scan files in directory
files_to_upload = []
for root, dirs, files in os.walk('.'):
    # Exclude git or node folders if any, and exclude the script itself
    if any(part.startswith('.') for part in root.split(os.sep)):
        continue
    for file in files:
        if file == 'upload_to_github.py':
            continue
        rel_path = os.path.relpath(os.path.join(root, file), '.')
        rel_path = rel_path.replace(os.sep, '/')
        files_to_upload.append(rel_path)

print(f"\nઅપલોડ કરવા માટે {len(files_to_upload)} ફાઇલો મળી છે:")
for f in files_to_upload:
    print(f" - {f}")
print("----------------------------------------------------")

def get_file_sha(path):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "Python-Urllib")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get('sha')
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        else:
            print(f"ચેતવણી: {path} માટે SHA ચકાસવામાં ભૂલ આવી (HTTP {e.code})")
            return None
    except Exception:
        return None

def upload_file(path):
    try:
        with open(path, 'rb') as f:
            file_data = f.read()
        b64_content = base64.b64encode(file_data).decode('utf-8')
    except Exception as e:
        print(f"ભૂલ: {path} ફાઇલ વાંચવામાં સમસ્યા આવી: {e}")
        return False
    
    sha = get_file_sha(path)
    
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    body = {
        "message": f"Upload {path} using python uploader script",
        "content": b64_content
    }
    if sha:
        body["sha"] = sha
        
    req_data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(url, data=req_data, method='PUT')
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "Python-Urllib")
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status in (200, 201):
                print(f"[સફળ] અપલોડ થઈ ગઈ: {path}")
                return True
    except urllib.error.HTTPError as e:
        print(f"[નિષ્ફળ] {path} અપલોડ કરવામાં સમસ્યા આવી (HTTP {e.code}: {e.reason})")
        try:
            err_data = json.loads(e.read().decode())
            print(f"   સંદેશો: {err_data.get('message')}")
        except:
            pass
    except Exception as e:
        print(f"[નિષ્ફળ] {path} અપલોડ થવામાં અજ્ઞાત ભૂલ: {e}")
    return False

success_count = 0
for file_path in files_to_upload:
    if upload_file(file_path):
        success_count += 1

print("----------------------------------------------------")
print(f"પરિણામ: કુલ {len(files_to_upload)} ફાઇલોમાંથી {success_count} સફળતાપૂર્વક અપલોડ થઈ.")
print("====================================================")
input("પૂર્ણ કરવા માટે Enter દબાવો...")
