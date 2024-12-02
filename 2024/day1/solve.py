from collections import Counter


with open("input.txt") as f:
    lines = f.read().splitlines()

left, right = [], []

for line in lines:
    l, r = line.split()
    left.append(int(l))
    right.append(int(r))

distance_sum = 0

for l, r in zip(sorted(left), sorted(right)):
    distance_sum += abs(l - r)

print("Difference sum: {}".format(distance_sum))

right_counts = Counter(right)
score = sum((val * right_counts[val] for val in left))
print("Similarity score: {}".format(score))
