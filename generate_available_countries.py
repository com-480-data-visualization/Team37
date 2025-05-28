import os
import json

# 设定interactive目录的绝对路径
base_dir = 'src/web/public/data/interactive'
country_codes = []

# 遍历所有子文件夹，收集国家代码
for name in os.listdir(base_dir):
    country_dir = os.path.join(base_dir, name)
    if os.path.isdir(country_dir):
        country_codes.append(name)

# 写入JSON文件
json_path = os.path.join(base_dir, 'available_countries.json')
with open(json_path, 'w') as f:
    json.dump(country_codes, f, indent=2)

print(f"已找到 {len(country_codes)} 个国家，已写入 {json_path}") 