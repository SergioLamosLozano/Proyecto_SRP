#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('backend/requirements.txt', 'rb') as f:
    raw = f.read()
    
print('BOM:', raw[:2].hex())
content = raw[2:].decode('utf-16le')
lines = content.splitlines()
print('First 5 lines:')
for i, line in enumerate(lines[:5]):
    print(f'{i+1}: "{line}"')
    if line.strip():
        package = line.split('==')[0].strip()
        print(f'   Package: "{package}"')