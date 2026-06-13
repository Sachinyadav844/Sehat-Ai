import os
from datasets import load_dataset

# iCliniq ke liye folder
os.makedirs('ai/datasets/conversations/icliniq', exist_ok=True)

print("Downloading iCliniq Consultation Dataset...")
# Yahan humne naam update karke 'chatdoctor-icliniq' kar diya hai
ds_ic = load_dataset('lavita/medical-qa-datasets', 'chatdoctor-icliniq')
ds_ic.save_to_disk('ai/datasets/medical-conversions/icliniq')

print("✅ iCliniq Dataset Downloaded Successfully!")