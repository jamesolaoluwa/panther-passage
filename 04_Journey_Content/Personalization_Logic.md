# Personalization Logic

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Inputs
Self-selected pathway (career, graduate-school, entrepreneurship, undecided), preferred topic, self-rated priorities, saved artifacts. All input is optional and editable.

## Deterministic algorithm
1. Find all incomplete **unlocked core milestones**.
2. Score `+2` if category aligns with pathway (career→career/network; grad-school→planning/network; entrepreneurship→finance/planning; undecided→identity).
3. Score `+1` if category is a self-selected priority.
4. Break ties by journey sequence ascending.
5. Show one recommendation plus 'See entire journey'.

Never suppress content because of a pathway; never infer sensitive traits or make high-stakes conclusions. For the demo, personal recommendations are explicitly rule-based, not AI.
