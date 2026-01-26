import os

def find_unused_badge():
    src_dir = 'c:/Users/acer/Desktop/LOSFER/losfer/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.jsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if 'import Badge' in content and '<Badge' not in content:
                        print(f"UNUSED BADGE IN: {path}")

if __name__ == "__main__":
    find_unused_badge()
