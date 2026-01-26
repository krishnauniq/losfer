import os
import re

def find_unused_badge():
    src_dir = 'c:/Users/acer/Desktop/LOSFER/losfer/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.jsx'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if re.search(r'import\s+Badge\s+from', content) or re.search(r'import\s+{\s*Badge\s*}\s+from', content):
                            usage_count = len(re.findall(r'<Badge', content))
                            print(f"{path} : {usage_count} usages")
                except Exception as e:
                    pass

if __name__ == "__main__":
    find_unused_badge()
