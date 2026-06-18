import re
from collections import Counter

src = open('appium-testing/test.py', encoding='utf-8').read()
tcs = re.findall(r'tc\("([^"]+)",\s*"(TC-\d+)"', src)
ids = [x[1] for x in tcs]
unique = sorted(set(ids), key=lambda x: int(x.split('-')[1]))

print(f"Total tc() calls  : {len(ids)}")
print(f"Unique IDs        : {len(unique)}")
print(f"Range             : {unique[0]} to {unique[-1]}")

dups = [k for k, v in Counter(ids).items() if v > 1]
print(f"Duplicates        : {dups if dups else 'None'}")

nums = [int(x.split('-')[1]) for x in unique]
gaps = [i for i in range(nums[0], nums[-1]+1) if i not in nums]
print(f"Gaps in numbering : {gaps if gaps else 'None'}")

print("\nModule breakdown:")
mods = {}
for mod, tid in tcs:
    mods.setdefault(mod, []).append(tid)
for mod, tid_list in mods.items():
    print(f"  {mod:30s} {len(tid_list):3d} tests")
