import os
import json
import csv
import glob

# Folders ka rasta
raw_base_dir = 'ai/datasets/medical-conversions/raw-data'
processed_dir = 'ai/datasets/medical-conversions/processed-data'
os.makedirs(processed_dir, exist_ok=True)

# Yeh words script ko batayenge ki kaunsa data patient ka hai aur kaunsa doctor ka
patient_keys = ['patient', 'user', 'query', 'question', 'input', 'q', 'instruction']
doctor_keys = ['doctor', 'agent', 'response', 'answer', 'output', 'a']

def extract_qa(row):
    patient_text = ""
    doctor_text = ""
    # Har column ka naam check karna
    for k, v in row.items():
        if k is None: continue
        k_lower = str(k).lower()
        if any(pk in k_lower for pk in patient_keys) and not patient_text:
            patient_text = str(v).strip()
        elif any(dk in k_lower for dk in doctor_keys) and not doctor_text:
            doctor_text = str(v).strip()
    
    # Agar dono mil gaye, toh RAG format bana do
    if patient_text and doctor_text:
        return {
            "patient_query": patient_text,
            "doctor_response": doctor_text,
            "rag_context": f"Medical Conversation -> Patient: {patient_text} | Doctor: {doctor_text}"
        }
    return None

def process_github_folders():
    print("🚀 Baki bache GitHub datasets ko process kar rahe hain...\n")
    
    # raw-data ke andar saare folders check karna
    for folder_name in os.listdir(raw_base_dir):
        # Jinhe hum pehle kar chuke hain, unhe skip kar do
        if folder_name in ['healthcaremagic', 'icliniq']:
            continue
            
        folder_path = os.path.join(raw_base_dir, folder_name)
        if not os.path.isdir(folder_path):
            continue
            
        print(f"🔍 Checking folder: {folder_name} ...")
        processed_data = []
        
        # Folder ke andar saari .json aur .csv files dhoondhna
        files_to_process = glob.glob(f"{folder_path}/**/*.json", recursive=True) + \
                           glob.glob(f"{folder_path}/**/*.csv", recursive=True)
        
        for file_path in files_to_process:
            # Bekar ki files ignore karna
            if 'package.json' in file_path or 'tsconfig' in file_path:
                continue
                
            try:
                if file_path.endswith('.csv'):
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            qa = extract_qa(row)
                            if qa: processed_data.append(qa)
                
                elif file_path.endswith('.json'):
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        data = json.load(f)
                        # Agar JSON list format mein hai
                        if isinstance(data, list):
                            for row in data:
                                if isinstance(row, dict):
                                    qa = extract_qa(row)
                                    if qa: processed_data.append(qa)
            except Exception as e:
                pass # Agar koi file corrupt ho toh chup-chap aage badh jao

        if processed_data:
            output_filename = f"{folder_name}_processed.json"
            output_path = os.path.join(processed_dir, output_filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(processed_data, f, indent=2)
            print(f"✅ Success! Saved {len(processed_data)} conversations from {folder_name}\n")
        else:
            print(f"⚠️ {folder_name} mein conversation format nahi mila (Skipped)\n")

if __name__ == "__main__":
    process_github_folders()