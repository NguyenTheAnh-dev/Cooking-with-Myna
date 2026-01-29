# READY_SET_COOK_RULES.md (Game Mechanics Cloning)

This document outlines the game mechanics and rules for cloning the gameplay experience of "Ready, Set, Cook!" for the "Cook with Myna" project.

## 1. Core Concept (Cooperative Cooking)

"Cook with Myna" allows 2-4 players to work together in a shared kitchen to prepare, cook, and serve dishes within a time limit.

- **Goal**: Serve as many correct orders as possible before the timer runs out.
- **Fail Condition**: Too many expired orders or low score.
- **Theme**: "Bánh bèo" - Cute girl characters, pink/pastel aesthetics.

## 2. Controls (Universal Tap-to-Move)

As requested, the control scheme unifies Desktop and Mobile:

- **Movement**: Tap/Click anywhere on the floor floor to move the character to that location.
  - **Logic**: Character finds path and moves towards the target.
- **Interaction**: Tap/Click on a **Station** to interact with it.
  - **Logic**: Character moves to the station within range -> Performs action automatically (e.g., Pick up, Place, Chop).
  - **No virtual buttons**: All actions are context-sensitive based on what the character is holding and the station type.

## 3. Gameplay Loop

1.  **Order Generation**: Customers appear (UI panel) with specific recipes (e.g., Burger = Bun + Meat + Cheese).
2.  **Ingredient Gathering**: Players fetch raw ingredients from **Crates/Dispensers**.
3.  **Preparation**:
    - **Cutting Board**: Chop raw ingredients (e.g., Tomato -> Chopped Tomato). Requires time.
4.  **Cooking**:
    - **Stove/Pan**: Cook raw meat (Raw Patty -> Cooked Patty).
    - **Risk**: If left too long, food **BURNS**. Burned food must be trashed.
5.  **Assembly**: Combine ingredients on a **Plate**.
6.  **Serving**: Bring the completed plate to the **Service Window**.
7.  **Dish Washing**: Used plates return as **Dirty Dishes**. Players must wash them at the **Sink** to reuse.

## 4. Station Types & Interactions

| Station Type           | Action (Tap Interaction)  | State Changes                   |
| :--------------------- | :------------------------ | :------------------------------ |
| **Crate**              | Spawns ingredient         | None -> Holding Ingredient      |
| **Cutting Board**      | Places item / Chops       | Raw -> Chopped (Progress Bar)   |
| **Stove (Frying Pan)** | Places item / Cooks       | Raw -> Cooked -> Burnt (Timer)  |
| **Counter (Empty)**    | Places/Picks item         | Holding <-> On Counter          |
| **Plate Dispenser**    | Picks up clean plate      | None -> Holding Plate           |
| **Sink**               | Places dirty plate / Wash | Dirty -> Clean (Progress Bar)   |
| **Trash Can**          | Discards held item        | Holding -> None                 |
| **Service Window**     | Delivers plated dish      | Holding Plate -> Score + Points |

## 5. Multiplayer Rules

- **Realtime Sync**: All players see each other moving and working in real-time.
- **Shared State**:
  - Orders are shared.
  - Station states (cooking progress, items on counter) are synchronized.
  - Items can be passed by placing them on a counter for another player to pick up.
- **Role Division**: Players naturally divide tasks (e.g., One person chops, one person cooks, one person washes).

## 6. Technical Implementation Guidelines

- **Engine**: PixiJS (already implemented).
- **Network**: Supabase Realtime (already implemented).
- **Input**: `PointerController` (Tap-to-Move/Interact).
- **Entities**:
  - `Character`: Has `state` (Idle, Walk, Chop, Carry).
  - `Interactable`: Base class for all stations.
  - `Item`: Held by character or placed on station.

## 7. Cloning "Ready, Set, Cook!" Specifics

To match the reference game specifically:

- **Chaotic Physics**: Not strictly required for 2D, but movement should be fast.
- **Level Variations**: Kitchen layouts change (e.g., split rooms, moving trucks).
- **Visual Feedback**:
  - Progress bars above stations.
  - Icons for "Needs Chopping" or "Risk of burning".
  - Satisfying sound effects for actions.

---

**Adhere to these rules for all future feature implementations.**
