"""
F 07: Candidate Ranking
Sorts scored candidates deterministically, highest match first,
with name as the documented tie break rule.
"""


def rank_candidates(candidates: list[dict]) -> list[dict]:
    ranked = sorted(candidates, key=lambda c: (-c["match_score"], c["name"]))
    for index, candidate in enumerate(ranked, start=1):
        candidate["rank"] = index
    return ranked