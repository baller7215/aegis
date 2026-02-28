"""shared types for analysis pipeline stages"""

from typing import Any


# metadata from content extraction (e.g. title, author, publish_date)
ContentMetadata = dict[str, Any]

# heuristic analysis signals (e.g. sensational_words, all_caps_ratio)
HeuristicResults = dict[str, Any]

# llm structured analysis output
LLMResults = dict[str, Any]

# risk scores and breakdown
RiskResults = dict[str, Any]
