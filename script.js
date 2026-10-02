/**
 * ParkWise - DSA Based Smart Parking Management System
 * Author: Lakshay Kumar | B.Tech CSE
 * Core JavaScript: Genuine Data Structures, Algorithms & UI Engine
 */

// =============================================================================
// 1. DATA STRUCTURE: LINKED LIST (Active Parked Vehicles)
// =============================================================================

/**
 * Node representing an active vehicle in the singly linked list.
 */
class ListNode {
  constructor(vehicle) {
    this.data = vehicle; // { regNo, vehicleType, driverName, slotId, entryTime, timestamp }
    this.next = null;
  }
}

/**
 * Singly LinkedList to store active parked vehicles dynamically.
 * Time Complexities:
 * - Insert (Append): O(1) with tail pointer
 * - Remove: O(n) search + pointer unlink
 * - Search: O(n) linear traversal
 */
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  insert(vehicle) {
    const newNode = new ListNode(vehicle);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return newNode;
  }

  remove(regNo) {
    if (!this.head) return null;

    let current = this.head;
    let prev = null;
    const target = regNo.trim().toUpperCase();

    while (current) {
      if (current.data.regNo.toUpperCase() === target) {
        if (prev === null) {
          this.head = current.next;
          if (this.head === null) this.tail = null;
        } else {
          prev.next = current.next;
          if (current === this.tail) {
            this.tail = prev;
          }
        }
        this.length--;
        return current.data;
      }
      prev = current;
      current = current.next;
    }
    return null;
  }

  search(regNo) {
    let current = this.head;
    let comparisons = 0;
    const target = regNo.trim().toUpperCase();

    while (current) {
      comparisons++;
      if (current.data.regNo.toUpperCase() === target) {
        return { found: true, vehicle: current.data, comparisons };
      }
      current = current.next;
    }
    return { found: false, vehicle: null, comparisons };
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}

// =============================================================================
// 2. DATA STRUCTURE: QUEUE (Waiting Vehicles FIFO)
// =============================================================================

/**
 * Queue data structure for waiting vehicles when parking is full.
 * Strictly follows First-In-First-Out (FIFO) discipline.
 * Time Complexities:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 */
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(vehicle) {
    this.items.push(vehicle);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  peek() {
    return this.isEmpty() ? null : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toArray() {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }
}

// =============================================================================
// 3. DATA STRUCTURE: STACK (Recent Operations LIFO)
// =============================================================================

/**
 * Stack data structure for tracking recent parking and exit events.
 * Strictly follows Last-In-First-Out (LIFO) discipline.
 * Time Complexities:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 */
class Stack {
  constructor(maxSize = 25) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(operation) {
    // operation: { action: "PARK"|"EXIT"|"ENQUEUE", regNo, slotId, timeStr, timestamp, details }
    this.items.push(operation);
    if (this.items.length > this.maxSize) {
      this.items.shift(); // retain bounded stack size
    }
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toArray() {
    return [...this.items].reverse(); // Top of stack first
  }

  clear() {
    this.items = [];
  }
}

// =============================================================================
// 4. DATA STRUCTURE: CUSTOM HASH MAP (Vehicle Fast Registry)
// =============================================================================

/**
 * Custom Hash Map with separate chaining collision resolution.
 * Hashes vehicle registration numbers to bucket indices.
 * Time Complexities:
 * - Set: Average O(1), Worst O(n)
 * - Get: Average O(1), Worst O(n)
 * - Delete: Average O(1), Worst O(n)
 */
class CustomHashMap {
  constructor(capacity = 11) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
    this.size = 0;
  }

  /**
   * Polynomial rolling hash function modulo capacity.
   */
  hash(key) {
    const str = String(key).trim().toUpperCase();
    let hashVal = 0;
    const PRIME = 31;
    for (let i = 0; i < str.length; i++) {
      hashVal = (hashVal * PRIME + str.charCodeAt(i)) % this.capacity;
    }
    return hashVal;
  }

  set(key, value) {
    const normKey = String(key).trim().toUpperCase();
    const index = this.hash(normKey);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === normKey) {
        bucket[i].value = value;
        return;
      }
    }

    bucket.push({ key: normKey, value });
    this.size++;
  }

  get(key) {
    const normKey = String(key).trim().toUpperCase();
    const index = this.hash(normKey);
    const bucket = this.buckets[index];
    let comparisons = 0;

    for (let i = 0; i < bucket.length; i++) {
      comparisons++;
      if (bucket[i].key === normKey) {
        return { found: true, value: bucket[i].value, bucketIndex: index, comparisons };
      }
    }

    return { found: false, value: null, bucketIndex: index, comparisons };
  }

  has(key) {
    return this.get(key).found;
  }

  delete(key) {
    const normKey = String(key).trim().toUpperCase();
    const index = this.hash(normKey);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === normKey) {
        const deleted = bucket.splice(i, 1)[0];
        this.size--;
        return deleted.value;
      }
    }
    return null;
  }

  getBuckets() {
    return this.buckets;
  }

  clear() {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.size = 0;
  }
}

// =============================================================================
// 5. DATA STRUCTURE: BINARY SEARCH TREE (BST) (Slots Index by Distance)
// =============================================================================

class BSTNode {
  constructor(key, slotData) {
    this.key = key; // distance or numeric identifier
    this.slotData = slotData;
    this.left = null;
    this.right = null;
  }
}

/**
 * Binary Search Tree to index slots for fast range lookup and sorted inorder traversal.
 * Time Complexities:
 * - Insert: O(log n) avg, O(n) worst
 * - Search: O(log n) avg, O(n) worst
 * - Inorder Traversal: O(n)
 */
class BST {
  constructor() {
    this.root = null;
  }

  insert(key, slotData) {
    const newNode = new BSTNode(key, slotData);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (key < current.key) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  search(key) {
    let current = this.root;
    let comparisons = 0;
    while (current) {
      comparisons++;
      if (key === current.key) {
        return { found: true, node: current, comparisons };
      }
      if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return { found: false, node: null, comparisons };
  }

  inorderTraversal() {
    const result = [];
    function traverse(node) {
      if (!node) return;
      traverse(node.left);
      result.push(node);
      traverse(node.right);
    }
    traverse(this.root);
    return result;
  }

  clear() {
    this.root = null;
  }
}

// =============================================================================
// 6. DATA STRUCTURE: MIN-HEAP / PRIORITY QUEUE (Smart Slot Recommender)
// =============================================================================

/**
 * Min-Heap implementation for optimal parking slot recommendation.
 * Elements have a priority score (lower is better):
 * score = (distance * 0.7) + (zonePreferencePenalty * 0.3)
 * Time Complexities:
 * - Insert: O(log n)
 * - ExtractMin: O(log n)
 * - Peek: O(1)
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  parent(i) { return Math.floor((i - 1) / 2); }
  leftChild(i) { return 2 * i + 1; }
  rightChild(i) { return 2 * i + 2; }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  insert(item) {
    // item: { slotId, score, distance, zone, preferenceFactor, reason }
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0 && this.heap[this.parent(index)].score > this.heap[index].score) {
      this.swap(index, this.parent(index));
      index = this.parent(index);
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  bubbleDown(index) {
    let smallest = index;
    const left = this.leftChild(index);
    const right = this.rightChild(index);

    if (left < this.heap.length && this.heap[left].score < this.heap[smallest].score) {
      smallest = left;
    }

    if (right < this.heap.length && this.heap[right].score < this.heap[smallest].score) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.bubbleDown(smallest);
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  getHeapArray() {
    return [...this.heap];
  }

  clear() {
    this.heap = [];
  }
}

// =============================================================================
// 7. DATA STRUCTURE: GRAPH (Adjacency List & BFS/DFS)
// =============================================================================

/**
 * Graph modeling the parking facility network using an adjacency list.
 * Nodes: Entrance, Zone A, Zone B, Zone C, Zone D, and parking bays.
 * Time Complexities:
 * - BFS: O(V + E)
 * - DFS: O(V + E)
 */
class ParkingGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    if (!this.adjacencyList.get(v1).includes(v2)) {
      this.adjacencyList.get(v1).push(v2);
    }
    if (!this.adjacencyList.get(v2).includes(v1)) {
      this.adjacencyList.get(v2).push(v1);
    }
  }

  /**
   * Breadth-First Search (BFS) to find reachable zones and nearest available slots.
   * Guarantees shortest path exploration in unweighted graph.
   */
  bfs(startNode) {
    const visited = new Set();
    const traversalOrder = [];
    const queue = new Queue();

    visited.add(startNode);
    queue.enqueue(startNode);

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      traversalOrder.push(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }

    return traversalOrder;
  }

  /**
   * Depth-First Search (DFS) for demonstrating recursive deep graph traversal.
   */
  dfs(startNode) {
    const visited = new Set();
    const traversalOrder = [];
    const adj = this.adjacencyList;

    function dfsHelper(vertex) {
      visited.add(vertex);
      traversalOrder.push(vertex);

      const neighbors = adj.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    }

    dfsHelper(startNode);
    return traversalOrder;
  }
}

// =============================================================================
// 8. SEARCHING ALGORITHMS
// =============================================================================

/**
 * Linear Search: O(n) sequential element comparison.
 */
function linearSearch(arr, keyName, targetVal) {
  const steps = [];
  const target = String(targetVal).trim().toUpperCase();
  let found = false;
  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    const currentVal = String(arr[i][keyName]).trim().toUpperCase();
    const match = currentVal === target;
    steps.push({ index: i, value: currentVal, match });
    if (match) {
      found = true;
      foundIndex = i;
      break;
    }
  }

  return { found, index: foundIndex, comparisons: steps.length, steps };
}

/**
 * Binary Search: O(log n) divide-and-conquer on sorted elements.
 */
function binarySearch(arr, keyName, targetVal) {
  const steps = [];
  const target = String(targetVal).trim().toUpperCase();
  let low = 0;
  let high = arr.length - 1;
  let found = false;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = String(arr[mid][keyName]).trim().toUpperCase();

    if (midVal === target) {
      steps.push({ low, high, mid, value: midVal, result: 'MATCH' });
      found = true;
      foundIndex = mid;
      break;
    } else if (midVal < target) {
      steps.push({ low, high, mid, value: midVal, result: 'TOO_LOW' });
      low = mid + 1;
    } else {
      steps.push({ low, high, mid, value: midVal, result: 'TOO_HIGH' });
      high = mid - 1;
    }
  }

  return { found, index: foundIndex, comparisons: steps.length, steps };
}

// =============================================================================
// 9. SORTING ALGORITHMS
// =============================================================================

/**
 * Bubble Sort: O(n²) comparison and adjacent swaps.
 */
function bubbleSort(array, keyName) {
  const arr = array.map(x => ({ ...x }));
  const steps = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const valA = arr[j][keyName];
      const valB = arr[j + 1][keyName];
      const shouldSwap = valA > valB;

      steps.push({
        type: 'COMPARE',
        indices: [j, j + 1],
        array: arr.map(x => ({ ...x })),
        pass: i + 1,
        comparisons,
        swaps
      });

      if (shouldSwap) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          type: 'SWAP',
          indices: [j, j + 1],
          array: arr.map(x => ({ ...x })),
          pass: i + 1,
          comparisons,
          swaps
        });
      }
    }
  }

  steps.push({
    type: 'DONE',
    indices: [],
    array: arr.map(x => ({ ...x })),
    pass: n,
    comparisons,
    swaps
  });

  return { sorted: arr, steps, totalComparisons: comparisons, totalSwaps: swaps };
}

/**
 * Selection Sort: O(n²) finding minimum element and swapping.
 */
function selectionSort(array, keyName) {
  const arr = array.map(x => ({ ...x }));
  const steps = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        type: 'COMPARE',
        indices: [minIdx, j],
        array: arr.map(x => ({ ...x })),
        minIdx,
        pass: i + 1,
        comparisons,
        swaps
      });

      if (arr[j][keyName] < arr[minIdx][keyName]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        type: 'SWAP',
        indices: [i, minIdx],
        array: arr.map(x => ({ ...x })),
        minIdx,
        pass: i + 1,
        comparisons,
        swaps
      });
    }
  }

  steps.push({
    type: 'DONE',
    indices: [],
    array: arr.map(x => ({ ...x })),
    pass: n,
    comparisons,
    swaps
  });

  return { sorted: arr, steps, totalComparisons: comparisons, totalSwaps: swaps };
}

// =============================================================================
// 10. SYSTEM STATE & INITIALIZATION
// =============================================================================

// Default 24 Parking Slots across 4 Zones
const DEFAULT_SLOTS = [
  // Zone A: Near Entrance (Distance: 10m - 25m)
  { id: "A1", zone: "A", number: 1, status: "available", distance: 10, vehicle: null },
  { id: "A2", zone: "A", number: 2, status: "available", distance: 12, vehicle: null },
  { id: "A3", zone: "A", number: 3, status: "available", distance: 15, vehicle: null },
  { id: "A4", zone: "A", number: 4, status: "available", distance: 18, vehicle: null },
  { id: "A5", zone: "A", number: 5, status: "available", distance: 22, vehicle: null },
  { id: "A6", zone: "A", number: 6, status: "available", distance: 25, vehicle: null },

  // Zone B: Central Courtyard (Distance: 30m - 45m)
  { id: "B1", zone: "B", number: 7, status: "available", distance: 30, vehicle: null },
  { id: "B2", zone: "B", number: 8, status: "available", distance: 32, vehicle: null },
  { id: "B3", zone: "B", number: 9, status: "available", distance: 35, vehicle: null },
  { id: "B4", zone: "B", number: 10, status: "available", distance: 38, vehicle: null },
  { id: "B5", zone: "B", number: 11, status: "available", distance: 42, vehicle: null },
  { id: "B6", zone: "B", number: 12, status: "available", distance: 45, vehicle: null },

  // Zone C: East Wing (Distance: 50m - 65m)
  { id: "C1", zone: "C", number: 13, status: "available", distance: 50, vehicle: null },
  { id: "C2", zone: "C", number: 14, status: "available", distance: 52, vehicle: null },
  { id: "C3", zone: "C", number: 15, status: "available", distance: 55, vehicle: null },
  { id: "C4", zone: "C", number: 16, status: "available", distance: 58, vehicle: null },
  { id: "C5", zone: "C", number: 17, status: "available", distance: 62, vehicle: null },
  { id: "C6", zone: "C", number: 18, status: "available", distance: 65, vehicle: null },

  // Zone D: Covered / EV Charging (Distance: 70m - 85m)
  { id: "D1", zone: "D", number: 19, status: "available", distance: 70, vehicle: null },
  { id: "D2", zone: "D", number: 20, status: "available", distance: 72, vehicle: null },
  { id: "D3", zone: "D", number: 21, status: "available", distance: 75, vehicle: null },
  { id: "D4", zone: "D", number: 22, status: "available", distance: 78, vehicle: null },
  { id: "D5", zone: "D", number: 23, status: "available", distance: 82, vehicle: null },
  { id: "D6", zone: "D", number: 24, status: "available", distance: 85, vehicle: null },
];

// Global DSA Instances
let parkingSlots = [];
const activeVehiclesList = new LinkedList();
const waitingQueue = new Queue();
const recentOperationsStack = new Stack(30);
const vehicleHashMap = new CustomHashMap(11);
const slotsBST = new BST();
const smartMinHeap = new MinHeap();
const parkingFacilityGraph = new ParkingGraph();
let parkingHistory = [];

/**
 * Initialize parking lot graph connections.
 */
function initParkingGraph() {
  parkingFacilityGraph.addEdge("Entrance", "Zone A");
  parkingFacilityGraph.addEdge("Entrance", "Zone B");
  parkingFacilityGraph.addEdge("Zone A", "Zone B");
  parkingFacilityGraph.addEdge("Zone B", "Zone C");
  parkingFacilityGraph.addEdge("Zone C", "Zone D");

  // Connect Zone A slots
  ["A1", "A2", "A3", "A4", "A5", "A6"].forEach(slot => {
    parkingFacilityGraph.addEdge("Zone A", slot);
  });

  // Connect Zone B slots
  ["B1", "B2", "B3", "B4", "B5", "B6"].forEach(slot => {
    parkingFacilityGraph.addEdge("Zone B", slot);
  });

  // Connect Zone C slots
  ["C1", "C2", "C3", "C4", "C5", "C6"].forEach(slot => {
    parkingFacilityGraph.addEdge("Zone C", slot);
  });

  // Connect Zone D slots
  ["D1", "D2", "D3", "D4", "D5", "D6"].forEach(slot => {
    parkingFacilityGraph.addEdge("Zone D", slot);
  });
}

/**
 * Rebuild Binary Search Tree from current slots.
 */
function rebuildBST() {
  slotsBST.clear();
  parkingSlots.forEach(slot => {
    slotsBST.insert(slot.distance, slot);
  });
}

/**
 * LocalStorage Persistence Helpers
 */
const STORAGE_KEYS = {
  SLOTS: 'parkwise_slots_v1',
  HISTORY: 'parkwise_history_v1',
  WAITING: 'parkwise_waiting_v1',
  STACK: 'parkwise_stack_v1'
};

function saveStateToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(parkingSlots));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parkingHistory));
    localStorage.setItem(STORAGE_KEYS.WAITING, JSON.stringify(waitingQueue.toArray()));
    localStorage.setItem(STORAGE_KEYS.STACK, JSON.stringify(recentOperationsStack.toArray()));
  } catch (err) {
    console.error("Error saving state to LocalStorage:", err);
  }
}

function loadStateFromLocalStorage() {
  try {
    const savedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedWaiting = localStorage.getItem(STORAGE_KEYS.WAITING);
    const savedStack = localStorage.getItem(STORAGE_KEYS.STACK);

    if (savedSlots) {
      parkingSlots = JSON.parse(savedSlots);
    } else {
      parkingSlots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
    }

    if (savedHistory) {
      parkingHistory = JSON.parse(savedHistory);
    } else {
      parkingHistory = [];
    }

    // Populate activeVehiclesList & vehicleHashMap from slots
    activeVehiclesList.clear();
    vehicleHashMap.clear();
    parkingSlots.forEach(slot => {
      if (slot.status === "occupied" && slot.vehicle) {
        activeVehiclesList.insert(slot.vehicle);
        vehicleHashMap.set(slot.vehicle.regNo, slot.vehicle);
      }
    });

    // Populate waitingQueue
    waitingQueue.clear();
    if (savedWaiting) {
      const waitArr = JSON.parse(savedWaiting);
      waitArr.forEach(item => waitingQueue.enqueue(item));
    }

    // Populate recentOperationsStack
    recentOperationsStack.clear();
    if (savedStack) {
      const stackArr = JSON.parse(savedStack);
      // stackArr is top-first, push in reverse order to preserve top
      stackArr.reverse().forEach(op => recentOperationsStack.push(op));
    }

  } catch (err) {
    console.error("Error loading state from LocalStorage:", err);
    parkingSlots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
  }

  rebuildBST();
}

// =============================================================================
// 11. SMART PARKING WORKFLOW (BFS + MIN-HEAP)
// =============================================================================

/**
 * Runs BFS from Entrance to find reachable zones and slots,
 * then prioritizes candidates using Min-Heap based on distance and driver preferences.
 */
function findBestSlot(preferences = {}) {
  const { preferredZone = "ANY", vehicleType = "Sedan" } = preferences;
  const logSteps = [];

  logSteps.push(`[1] Starting BFS Graph Traversal from Origin: "Entrance"...`);
  const traversalOrder = parkingFacilityGraph.bfs("Entrance");
  logSteps.push(`[2] Traversal discovered ${traversalOrder.length} reachable nodes in order: ${traversalOrder.slice(0, 7).join(' -> ')}...`);

  // Filter available candidate slots from reachable nodes
  const availableCandidates = [];
  parkingSlots.forEach(slot => {
    if (slot.status === "available" && traversalOrder.includes(slot.id)) {
      availableCandidates.push(slot);
    }
  });

  logSteps.push(`[3] Filtered ${availableCandidates.length} available candidate bays from total slots.`);

  if (availableCandidates.length === 0) {
    logSteps.push(`[!] PARKING LOT FULL: No available candidates in reachable zones.`);
    return { bestSlot: null, logSteps, minHeapItems: [] };
  }

  // Populate Min-Heap
  smartMinHeap.clear();
  logSteps.push(`[4] Calculating priority cost scores and inserting candidates into Min-Heap...`);

  availableCandidates.forEach(slot => {
    let penalty = 0;
    if (preferredZone !== "ANY" && slot.zone !== preferredZone) {
      penalty += 35; // penalty for not matching zone preference
    }
    if (vehicleType === "EV" && slot.zone !== "D") {
      penalty += 20; // EV prefers Zone D
    }
    if (vehicleType === "SUV" && (slot.id === "A1" || slot.id === "A2")) {
      penalty += 15; // A1, A2 compact slots
    }

    // Composite Priority Score formula:
    // Lower score is higher priority!
    const score = Number((slot.distance * 0.7 + penalty * 0.3).toFixed(2));

    const heapItem = {
      slotId: slot.id,
      score,
      distance: slot.distance,
      zone: slot.zone,
      reason: penalty === 0 ? "Optimal Zone & Distance" : `Zone penalty applied (+${penalty})`
    };

    smartMinHeap.insert(heapItem);
  });

  const minHeapSnapshot = smartMinHeap.getHeapArray();
  logSteps.push(`[5] Min-Heap constructed with ${minHeapSnapshot.length} candidate nodes. Root peek: Slot ${minHeapSnapshot[0].slotId} (Score: ${minHeapSnapshot[0].score})`);

  // Extract root minimum element
  const bestCandidate = smartMinHeap.extractMin();
  logSteps.push(`[6] extractMin() executed -> Selected Optimal Bay: Slot ${bestCandidate.slotId}!`);

  const matchedSlot = parkingSlots.find(s => s.id === bestCandidate.slotId);
  return { bestSlot: matchedSlot, score: bestCandidate.score, logSteps, minHeapItems: minHeapSnapshot };
}

/**
 * Executes vehicle parking into a given slot ID.
 */
function parkVehicle(vehicleData, targetSlotId) {
  const normPlate = vehicleData.regNo.trim().toUpperCase();

  // 1. Check if vehicle is already parked using Hash Map (O(1))
  if (vehicleHashMap.has(normPlate)) {
    return { success: false, message: `Vehicle ${normPlate} is already parked in the lot!` };
  }

  // 2. Locate slot in Array
  const slotIndex = parkingSlots.findIndex(s => s.id === targetSlotId);
  if (slotIndex === -1) {
    return { success: false, message: `Slot ${targetSlotId} does not exist!` };
  }

  if (parkingSlots[slotIndex].status === "occupied") {
    return { success: false, message: `Slot ${targetSlotId} is already occupied!` };
  }

  const now = new Date();
  const vehicle = {
    regNo: normPlate,
    vehicleType: vehicleData.vehicleType || "Sedan",
    driverName: vehicleData.driverName || "Driver",
    slotId: targetSlotId,
    zone: parkingSlots[slotIndex].zone,
    entryTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: now.getTime()
  };

  // 3. Update Slot Array
  parkingSlots[slotIndex].status = "occupied";
  parkingSlots[slotIndex].vehicle = vehicle;

  // 4. Insert into Linked List (O(1))
  activeVehiclesList.insert(vehicle);

  // 5. Insert into Hash Map (O(1))
  vehicleHashMap.set(normPlate, vehicle);

  // 6. Push operation into Stack (O(1))
  const opRecord = {
    action: "PARK",
    regNo: normPlate,
    slotId: targetSlotId,
    timeStr: vehicle.entryTime,
    timestamp: vehicle.timestamp,
    details: `${vehicle.vehicleType} parked in Slot ${targetSlotId} (${parkingSlots[slotIndex].distance}m)`
  };
  recentOperationsStack.push(opRecord);

  // 7. Add to History
  parkingHistory.unshift(opRecord);

  // 8. Save & Update
  saveStateToLocalStorage();
  updateUI();

  return { success: true, slot: parkingSlots[slotIndex], vehicle };
}

/**
 * Handles parking entry when all slots are full -> Enqueues into FIFO Queue.
 */
function enqueueWaitingVehicle(vehicleData) {
  const normPlate = vehicleData.regNo.trim().toUpperCase();

  if (vehicleHashMap.has(normPlate)) {
    return { success: false, message: `Vehicle ${normPlate} is already parked!` };
  }

  const waitingList = waitingQueue.toArray();
  if (waitingList.some(v => v.regNo === normPlate)) {
    return { success: false, message: `Vehicle ${normPlate} is already in the waiting queue!` };
  }

  const now = new Date();
  const waitingItem = {
    regNo: normPlate,
    vehicleType: vehicleData.vehicleType || "Sedan",
    driverName: vehicleData.driverName || "Driver",
    preferredZone: vehicleData.preferredZone || "ANY",
    queueTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: now.getTime()
  };

  waitingQueue.enqueue(waitingItem);

  const opRecord = {
    action: "ENQUEUE",
    regNo: normPlate,
    slotId: "QUEUE",
    timeStr: waitingItem.queueTime,
    timestamp: waitingItem.timestamp,
    details: `Added to waiting queue at position #${waitingQueue.size()}`
  };
  recentOperationsStack.push(opRecord);
  parkingHistory.unshift(opRecord);

  saveStateToLocalStorage();
  updateUI();

  return { success: true, position: waitingQueue.size() };
}

/**
 * Executes vehicle exit:
 * - O(1) Hash Map lookup
 * - Unlink from Linked List
 * - Free slot in Array
 * - Push exit op to Stack
 * - Auto-dequeue waiting vehicle if any!
 */
function exitVehicle(regNo) {
  const normPlate = regNo.trim().toUpperCase();

  // 1. Fast lookup via Hash Map
  const lookup = vehicleHashMap.get(normPlate);
  if (!lookup.found) {
    return { success: false, message: `Vehicle ${normPlate} is not parked in this lot!` };
  }

  const vehicle = lookup.value;
  const slotId = vehicle.slotId;

  // 2. Remove from Hash Map (O(1))
  vehicleHashMap.delete(normPlate);

  // 3. Remove from Linked List (O(n))
  activeVehiclesList.remove(normPlate);

  // 4. Mark Slot available in Array
  const slotIndex = parkingSlots.findIndex(s => s.id === slotId);
  if (slotIndex !== -1) {
    parkingSlots[slotIndex].status = "available";
    parkingSlots[slotIndex].vehicle = null;
  }

  // 5. Calculate Duration & Fee
  const exitTime = new Date();
  const durationMinutes = Math.max(1, Math.round((exitTime.getTime() - vehicle.timestamp) / 60000));
  const fee = Math.max(30, Math.ceil(durationMinutes / 60) * 40);

  // 6. Push exit op into Stack
  const opRecord = {
    action: "EXIT",
    regNo: normPlate,
    slotId: slotId,
    timeStr: exitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: exitTime.getTime(),
    details: `Exited Slot ${slotId}. Duration: ${durationMinutes} min, Fee: ₹${fee}`
  };
  recentOperationsStack.push(opRecord);
  parkingHistory.unshift(opRecord);

  // 7. Check if vehicles are waiting in Queue (FIFO)
  let promotedWaitingCar = null;
  if (!waitingQueue.isEmpty()) {
    const nextCar = waitingQueue.dequeue();
    promotedWaitingCar = nextCar;

    // Immediately allocate the freed slot to the waiting vehicle
    parkVehicle({
      regNo: nextCar.regNo,
      vehicleType: nextCar.vehicleType,
      driverName: nextCar.driverName
    }, slotId);
  }

  saveStateToLocalStorage();
  updateUI();

  return {
    success: true,
    vehicle,
    slotId,
    durationMinutes,
    fee,
    promotedWaitingCar
  };
}

// =============================================================================
// 12. UI RENDERING & COMPONENT SYNCHRONIZATION
// =============================================================================

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

/**
 * Updates all dashboard metrics, header stats, and visualizers.
 */
function updateUI() {
  const totalSlots = parkingSlots.length;
  const occupiedSlots = parkingSlots.filter(s => s.status === 'occupied').length;
  const availableSlots = totalSlots - occupiedSlots;
  const waitingCount = waitingQueue.size();
  const activeCount = activeVehiclesList.length;

  // Header stats
  const statAvail = document.getElementById('header-stat-avail');
  const statOcc = document.getElementById('header-stat-occ');
  const statWait = document.getElementById('header-stat-wait');
  const navSlotCount = document.getElementById('nav-slot-count');

  if (statAvail) statAvail.textContent = availableSlots;
  if (statOcc) statOcc.textContent = occupiedSlots;
  if (statWait) statWait.textContent = waitingCount;
  if (navSlotCount) navSlotCount.textContent = `${occupiedSlots}/${totalSlots}`;

  // Dashboard Metrics
  const dashTotal = document.getElementById('dash-total-slots');
  const dashAvail = document.getElementById('dash-avail-slots');
  const dashOcc = document.getElementById('dash-occ-slots');
  const dashActive = document.getElementById('dash-active-vehicles');
  const dashWait = document.getElementById('dash-wait-vehicles');

  if (dashTotal) dashTotal.textContent = totalSlots;
  if (dashAvail) dashAvail.textContent = availableSlots;
  if (dashOcc) dashOcc.textContent = occupiedSlots;
  if (dashActive) dashActive.textContent = activeCount;
  if (dashWait) dashWait.textContent = waitingCount;

  // Best Slot Hint in Banner
  const bannerBestSlot = document.getElementById('banner-best-slot');
  if (bannerBestSlot) {
    const avail = parkingSlots.find(s => s.status === 'available');
    bannerBestSlot.textContent = avail ? avail.id : 'FULL';
  }

  // Render components
  renderDashboardSlots();
  renderDashboardStack();
  renderDashboardQueue();
  renderFullSlotsGrid();
  renderActiveVehiclesTable();
  renderHistoryTable();
  populateManualSlotDropdown();
  renderAllVisualizers();
}

/**
 * Render quick slots map in Dashboard.
 */
function renderDashboardSlots(filterZone = 'ALL') {
  const container = document.getElementById('dash-slots-container');
  if (!container) return;

  container.innerHTML = '';
  const filtered = filterZone === 'ALL'
    ? parkingSlots
    : parkingSlots.filter(s => s.zone === filterZone);

  filtered.forEach(slot => {
    const tile = document.createElement('div');
    tile.className = `slot-tile ${slot.status}`;
    tile.dataset.slotId = slot.id;
    tile.innerHTML = `
      <div class="slot-header">
        <span class="slot-id">${slot.id}</span>
        <span class="slot-dist">${slot.distance}m</span>
      </div>
      <div class="slot-status-pill ${slot.status === 'available' ? 'avail' : 'occ'}">
        ${slot.status}
      </div>
      <div class="slot-vehicle-info">
        ${slot.vehicle ? slot.vehicle.regNo : 'Empty Bay'}
      </div>
    `;

    tile.addEventListener('click', () => openSlotModal(slot.id));
    container.appendChild(tile);
  });
}

/**
 * Render recent operations in Dashboard (Stack LIFO).
 */
function renderDashboardStack() {
  const container = document.getElementById('dash-stack-container');
  if (!container) return;

  const stackArr = recentOperationsStack.toArray();
  if (stackArr.length === 0) {
    container.innerHTML = `<div class="empty-state-text">No recent operations. Push operations by parking or exiting a car.</div>`;
    return;
  }

  container.innerHTML = '';
  stackArr.slice(0, 5).forEach((op, index) => {
    const item = document.createElement('div');
    item.className = `stack-item ${index === 0 ? 'top' : ''}`;
    item.innerHTML = `
      <div>
        ${index === 0 ? '<span class="stack-top-badge">TOP</span>' : ''}
        <strong>[${op.action}]</strong> ${op.regNo} @ Slot ${op.slotId}
      </div>
      <span class="slot-dist">${op.timeStr}</span>
    `;
    container.appendChild(item);
  });
}

/**
 * Render waiting queue in Dashboard (Queue FIFO).
 */
function renderDashboardQueue() {
  const container = document.getElementById('dash-queue-container');
  if (!container) return;

  const queueArr = waitingQueue.toArray();
  if (queueArr.length === 0) {
    container.innerHTML = `<div class="empty-state-text">Waiting queue is empty. When all 24 slots are occupied, incoming cars queue here in FIFO order.</div>`;
    return;
  }

  container.innerHTML = '';
  queueArr.forEach((car, index) => {
    const pill = document.createElement('div');
    pill.className = 'queue-car-pill';
    pill.innerHTML = `
      <span class="queue-pos-badge">${index === 0 ? 'FRONT (1st)' : `#${index + 1} In Line`}</span>
      <span class="queue-plate">${car.regNo}</span>
      <span class="queue-time">${car.vehicleType} • ${car.queueTime}</span>
    `;
    container.appendChild(pill);
  });
}

/**
 * Render full parking lot grid on Parking Slots Page.
 */
function renderFullSlotsGrid() {
  const container = document.getElementById('slots-full-container');
  if (!container) return;

  const zoneFilter = document.getElementById('slots-filter-zone')?.value || 'ALL';
  const statusFilter = document.getElementById('slots-filter-status')?.value || 'ALL';

  let filtered = parkingSlots;
  if (zoneFilter !== 'ALL') {
    filtered = filtered.filter(s => s.zone === zoneFilter);
  }
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(s => s.status === statusFilter);
  }

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-text" style="grid-column: 1/-1;">No parking slots match the selected filters.</div>`;
    return;
  }

  filtered.forEach(slot => {
    const card = document.createElement('div');
    card.className = `slot-card-large ${slot.status}`;
    card.innerHTML = `
      <div class="slot-card-head">
        <span class="slot-num">${slot.id}</span>
        <span class="slot-zone-pill">Zone ${slot.zone}</span>
      </div>
      <div class="slot-card-body">
        <div class="slot-detail-row">
          <span class="k">Distance from Entrance:</span>
          <span class="v">${slot.distance} meters</span>
        </div>
        <div class="slot-detail-row">
          <span class="k">Status:</span>
          <span class="v ${slot.status === 'available' ? 'text-emerald' : 'text-rose'}">
            ${slot.status.toUpperCase()}
          </span>
        </div>
        <div class="slot-detail-row">
          <span class="k">Vehicle Plate:</span>
          <span class="v plate">${slot.vehicle ? slot.vehicle.regNo : 'None'}</span>
        </div>
        ${slot.vehicle ? `
        <div class="slot-detail-row">
          <span class="k">Driver:</span>
          <span class="v">${slot.vehicle.driverName}</span>
        </div>
        <div class="slot-detail-row">
          <span class="k">Parked At:</span>
          <span class="v">${slot.vehicle.entryTime}</span>
        </div>
        ` : ''}
      </div>
      <div class="slot-card-actions">
        ${slot.status === 'available'
          ? `<button class="btn btn-emerald btn-sm w-100 btn-park-slot" data-slot="${slot.id}">Park Here</button>`
          : `<button class="btn btn-outline-danger btn-sm w-100 btn-exit-slot" data-plate="${slot.vehicle.regNo}">Exit Vehicle</button>`
        }
      </div>
    `;

    card.querySelector('.btn-park-slot')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openParkModalForSlot(slot.id);
    });

    card.querySelector('.btn-exit-slot')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDirectExit(slot.vehicle.regNo);
    });

    card.addEventListener('click', () => openSlotModal(slot.id));
    container.appendChild(card);
  });
}

/**
 * Populate manual slot dropdown in Entry/Exit page.
 */
function populateManualSlotDropdown() {
  const select = document.getElementById('entry-manual-slot');
  if (!select) return;

  select.innerHTML = '';
  const avail = parkingSlots.filter(s => s.status === 'available');
  if (avail.length === 0) {
    select.innerHTML = '<option value="">No Slots Available (Lot Full)</option>';
    return;
  }

  avail.forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot.id;
    opt.textContent = `${slot.id} (Zone ${slot.zone}, ${slot.distance}m from entrance)`;
    select.appendChild(opt);
  });
}

/**
 * Render active parked vehicles table.
 */
function renderActiveVehiclesTable() {
  const tbody = document.getElementById('tbody-active-vehicles');
  if (!tbody) return;

  const filterText = document.getElementById('active-vehicles-search')?.value.trim().toUpperCase() || '';
  const vehicles = activeVehiclesList.toArray();

  const filtered = filterText
    ? vehicles.filter(v => v.regNo.includes(filterText) || v.slotId.includes(filterText) || v.driverName.toUpperCase().includes(filterText))
    : vehicles;

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No active parked vehicles found.</td></tr>`;
    return;
  }

  filtered.forEach((veh, idx) => {
    const tr = document.createElement('tr');
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - veh.timestamp) / 60000));
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${veh.regNo}</strong></td>
      <td><span class="slot-zone-pill">${veh.vehicleType}</span></td>
      <td>${veh.driverName}</td>
      <td><strong class="text-cyan">${veh.slotId}</strong></td>
      <td>Zone ${veh.zone}</td>
      <td>${veh.entryTime}</td>
      <td>${elapsedMinutes} min</td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="handleDirectExit('${veh.regNo}')">
          Exit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Render history audit log table.
 */
function renderHistoryTable() {
  const tbody = document.getElementById('tbody-history');
  if (!tbody) return;

  const filterAction = document.getElementById('history-filter-action')?.value || 'ALL';
  const filtered = filterAction === 'ALL'
    ? parkingHistory
    : parkingHistory.filter(h => h.action === filterAction);

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No historical operations recorded yet.</td></tr>`;
    return;
  }

  filtered.forEach((item, index) => {
    const tr = document.createElement('tr');
    const badgeColor = item.action === 'PARK' ? 'text-emerald' : item.action === 'EXIT' ? 'text-rose' : 'text-amber';
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong class="${badgeColor}">[${item.action}]</strong></td>
      <td><strong>${item.regNo}</strong></td>
      <td>${item.slotId}</td>
      <td>${item.timeStr || new Date(item.timestamp).toLocaleTimeString()}</td>
      <td class="text-muted">${item.details}</td>
    `;
    tbody.appendChild(tr);
  });
}

// =============================================================================
// 13. DSA VISUALIZERS RENDERING (ALL 8 STRUCTURES)
// =============================================================================

function renderAllVisualizers() {
  renderArrayVisualizer();
  renderLinkedListVisualizer();
  renderQueueVisualizer();
  renderStackVisualizer();
  renderHashMapVisualizer();
  renderBSTVisualizer();
  renderMinHeapVisualizer();
  renderGraphVisualizer();
}

/**
 * Visualizer 1: Array (parkingSlots[0..23])
 */
function renderArrayVisualizer() {
  const container = document.getElementById('viz-array-container');
  if (!container) return;

  container.innerHTML = '';
  parkingSlots.forEach((slot, index) => {
    const box = document.createElement('div');
    box.className = `arr-box ${slot.status === 'available' ? 'avail' : 'occ'}`;
    box.innerHTML = `
      <div class="arr-index">[${index}]</div>
      <div class="arr-content">${slot.id}</div>
      <div class="slot-dist">${slot.vehicle ? slot.vehicle.regNo.slice(0, 6) : 'FREE'}</div>
    `;
    container.appendChild(box);
  });
}

/**
 * Visualizer 2: Linked List (Active Parked Vehicles)
 */
function renderLinkedListVisualizer() {
  const stage = document.getElementById('viz-ll-stage');
  if (!stage) return;

  stage.innerHTML = '';
  const headTag = document.createElement('div');
  headTag.className = 'll-head-tag';
  headTag.textContent = 'HEAD';
  stage.appendChild(headTag);

  let current = activeVehiclesList.head;
  if (!current) {
    const emptyArrow = document.createElement('div');
    emptyArrow.className = 'll-arrow';
    emptyArrow.textContent = '➔';
    stage.appendChild(emptyArrow);

    const nullTag = document.createElement('div');
    nullTag.className = 'll-null-tag';
    nullTag.textContent = 'NULL (Empty List)';
    stage.appendChild(nullTag);
    return;
  }

  while (current) {
    const arrow = document.createElement('div');
    arrow.className = 'll-arrow';
    arrow.textContent = '➔';
    stage.appendChild(arrow);

    const node = document.createElement('div');
    node.className = 'll-node';
    node.innerHTML = `
      <div class="ll-data">
        <span class="ll-plate">${current.data.regNo}</span>
        <span class="ll-slot">Slot ${current.data.slotId} • ${current.data.vehicleType}</span>
      </div>
      <div class="ll-pointer">next*</div>
    `;
    stage.appendChild(node);
    current = current.next;
  }

  const endArrow = document.createElement('div');
  endArrow.className = 'll-arrow';
  endArrow.textContent = '➔';
  stage.appendChild(endArrow);

  const nullTag = document.createElement('div');
  nullTag.className = 'll-null-tag';
  nullTag.textContent = 'NULL';
  stage.appendChild(nullTag);
}

/**
 * Visualizer 3: Queue (Waiting Vehicles FIFO)
 */
function renderQueueVisualizer() {
  const stage = document.getElementById('viz-queue-stage');
  if (!stage) return;

  stage.innerHTML = '';

  const frontPill = document.createElement('div');
  frontPill.className = 'queue-tag-pill';
  frontPill.textContent = 'FRONT ➔ Dequeue';
  stage.appendChild(frontPill);

  const items = waitingQueue.toArray();
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state-text';
    empty.textContent = 'Queue is empty (no vehicles waiting).';
    stage.appendChild(empty);
  } else {
    items.forEach((car, idx) => {
      const node = document.createElement('div');
      node.className = 'queue-node-box';
      node.innerHTML = `
        <span class="slot-dist">Pos #${idx + 1}</span>
        <strong>${car.regNo}</strong>
        <span class="text-muted" style="font-size:0.75rem;">${car.vehicleType}</span>
      `;
      stage.appendChild(node);
    });
  }

  const rearPill = document.createElement('div');
  rearPill.className = 'queue-tag-pill';
  rearPill.textContent = '➔ REAR (Enqueue)';
  stage.appendChild(rearPill);
}

/**
 * Visualizer 4: Stack (Recent Operations LIFO)
 */
function renderStackVisualizer() {
  const stage = document.getElementById('viz-stack-stage');
  if (!stage) return;

  stage.innerHTML = '';
  const ops = recentOperationsStack.toArray(); // top first

  if (ops.length === 0) {
    stage.innerHTML = `<div class="empty-state-text">Stack is empty. Operations will be pushed from bottom to top.</div>`;
    return;
  }

  // Render bottom-to-top (reverse of toArray)
  const bottomToTop = [...ops].reverse();
  bottomToTop.forEach((op, idx) => {
    const isTop = idx === bottomToTop.length - 1;
    const card = document.createElement('div');
    card.className = 'stack-node-card';
    card.innerHTML = `
      <div>
        ${isTop ? '<span class="stack-top-badge">TOP (Peek)</span>' : `<span class="slot-dist">[${idx}]</span>`}
        <strong>[${op.action}]</strong> ${op.regNo}
      </div>
      <span class="slot-dist">${op.slotId} • ${op.timeStr}</span>
    `;
    stage.appendChild(card);
  });
}

/**
 * Visualizer 5: Hash Map (Buckets & Separate Chaining)
 */
function renderHashMapVisualizer() {
  const stage = document.getElementById('viz-hashmap-stage');
  if (!stage) return;

  stage.innerHTML = '';
  const buckets = vehicleHashMap.getBuckets();

  buckets.forEach((chain, idx) => {
    const row = document.createElement('div');
    row.className = 'hash-bucket-row';

    let chainHtml = '';
    if (chain.length === 0) {
      chainHtml = `<span class="text-muted" style="font-size:0.75rem;">null (empty bucket)</span>`;
    } else {
      chain.forEach((entry, i) => {
        chainHtml += `
          <div class="bucket-node">
            <strong>${entry.key}</strong>
            <span class="slot-dist">Slot: ${entry.value.slotId}</span>
          </div>
          ${i < chain.length - 1 ? '<span class="ll-arrow">➔</span>' : ''}
        `;
      });
    }

    row.innerHTML = `
      <div class="bucket-idx-badge">B[${idx}]</div>
      <div class="bucket-chain">${chainHtml}</div>
    `;
    stage.appendChild(row);
  });
}

/**
 * Visualizer 6: Binary Search Tree (BST)
 */
function renderBSTVisualizer() {
  const stage = document.getElementById('viz-bst-stage');
  if (!stage) return;

  const root = slotsBST.root;
  if (!root) {
    stage.innerHTML = `<div class="empty-state-text">BST is currently empty.</div>`;
    return;
  }

  // Render clean SVG tree diagram
  stage.innerHTML = `
    <svg width="100%" height="340" viewBox="0 0 700 340">
      <defs>
        <filter id="glow-bst" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#3b82f6" flood-opacity="0.4"/>
        </filter>
      </defs>
      <g id="bst-svg-links"></g>
      <g id="bst-svg-nodes"></g>
    </svg>
  `;

  const linksGroup = stage.querySelector('#bst-svg-links');
  const nodesGroup = stage.querySelector('#bst-svg-nodes');

  // Simple recursive layout for top levels of BST
  function drawTree(node, x, y, dx, level) {
    if (!node || level > 4) return;

    if (node.left) {
      const lx = x - dx;
      const ly = y + 60;
      linksGroup.innerHTML += `<line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" stroke="#233149" stroke-width="2"/>`;
      drawTree(node.left, lx, ly, dx * 0.55, level + 1);
    }

    if (node.right) {
      const rx = x + dx;
      const ry = y + 60;
      linksGroup.innerHTML += `<line x1="${x}" y1="${y}" x2="${rx}" y2="${ry}" stroke="#233149" stroke-width="2"/>`;
      drawTree(node.right, rx, ry, dx * 0.55, level + 1);
    }

    const isOccupied = node.slotData && node.slotData.status === 'occupied';
    nodesGroup.innerHTML += `
      <g class="bst-node-group" transform="translate(${x}, ${y})">
        <circle r="18" fill="${isOccupied ? '#ef4444' : '#10b981'}" stroke="#38bdf8" stroke-width="2" filter="url(#glow-bst)"/>
        <text text-anchor="middle" dy="4" fill="#ffffff" font-size="10" font-weight="bold">${node.slotData ? node.slotData.id : node.key}</text>
      </g>
    `;
  }

  drawTree(root, 350, 40, 160, 1);
}

/**
 * Visualizer 7: Min-Heap
 */
function renderMinHeapVisualizer() {
  const stage = document.getElementById('viz-heap-stage');
  if (!stage) return;

  // Build heap if empty
  if (smartMinHeap.size() === 0) {
    parkingSlots.filter(s => s.status === 'available').forEach(s => {
      smartMinHeap.insert({
        slotId: s.id,
        score: s.distance,
        distance: s.distance,
        zone: s.zone,
        reason: "Available"
      });
    });
  }

  const heapArr = smartMinHeap.getHeapArray();
  stage.innerHTML = `
    <div>
      <h4 style="font-size:0.9rem; margin-bottom:8px; color:var(--text-muted);">
        1. Array Representation (Index formula: parent(i)=⌊(i-1)/2⌋, left=2i+1, right=2i+2)
      </h4>
      <div class="heap-array-view">
        ${heapArr.map((item, idx) => `
          <div class="heap-arr-cell">
            <div class="heap-arr-idx">i=${idx}</div>
            <div class="heap-arr-val">${item.slotId}</div>
            <div class="heap-arr-score">Score: ${item.score}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="margin-top:14px;">
      <h4 style="font-size:0.9rem; margin-bottom:8px; color:var(--text-muted);">
        2. Heap Property: Root is ALWAYS the minimum score (optimal bay)
      </h4>
      <div style="background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:8px; padding:12px;">
        ${heapArr.length > 0
          ? `<strong class="text-cyan">Root Min:</strong> Bay ${heapArr[0].slotId} with lowest score ${heapArr[0].score} (Distance: ${heapArr[0].distance}m, Zone ${heapArr[0].zone})`
          : 'Heap is empty.'}
      </div>
    </div>
  `;
}

/**
 * Visualizer 8: Interactive Parking Graph (SVG with BFS/DFS animation)
 */
const GRAPH_NODE_POSITIONS = {
  "Entrance": { x: 80, y: 240, label: "ENTRANCE", type: "gate" },
  "Zone A": { x: 260, y: 120, label: "ZONE A", type: "zone" },
  "Zone B": { x: 260, y: 360, label: "ZONE B", type: "zone" },
  "Zone C": { x: 480, y: 360, label: "ZONE C", type: "zone" },
  "Zone D": { x: 680, y: 360, label: "ZONE D", type: "zone" },
  "A1": { x: 220, y: 40 }, "A2": { x: 280, y: 40 }, "A3": { x: 340, y: 40 },
  "B1": { x: 220, y: 440 }, "B2": { x: 280, y: 440 }, "B3": { x: 340, y: 440 },
  "C1": { x: 440, y: 440 }, "C2": { x: 500, y: 440 }, "C3": { x: 560, y: 440 },
  "D1": { x: 640, y: 440 }, "D2": { x: 700, y: 440 }, "D3": { x: 760, y: 440 }
};

function renderGraphVisualizer() {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;

  svg.innerHTML = '';

  // Draw Edges
  parkingFacilityGraph.adjacencyList.forEach((neighbors, node) => {
    const posA = GRAPH_NODE_POSITIONS[node];
    if (!posA) return;

    neighbors.forEach(neighbor => {
      const posB = GRAPH_NODE_POSITIONS[neighbor];
      if (!posB) return;

      // Draw only once
      if (node < neighbor) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", posA.x);
        line.setAttribute("y1", posA.y);
        line.setAttribute("x2", posB.x);
        line.setAttribute("y2", posB.y);
        line.setAttribute("stroke", "#233149");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("id", `edge-${node.replace(/\s+/g, '')}-${neighbor.replace(/\s+/g, '')}`);
        svg.appendChild(line);
      }
    });
  });

  // Draw Nodes
  Object.keys(GRAPH_NODE_POSITIONS).forEach(nodeId => {
    const pos = GRAPH_NODE_POSITIONS[nodeId];
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", `gnode-${nodeId.replace(/\s+/g, '')}`);
    g.setAttribute("class", "graph-node-group");
    g.style.cursor = "pointer";

    const isGate = pos.type === "gate";
    const isZone = pos.type === "zone";
    const radius = isGate ? 24 : isZone ? 22 : 14;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", isGate ? "#06b6d4" : isZone ? "#3b82f6" : "#1e293b");
    circle.setAttribute("stroke", "#38bdf8");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("id", `circle-${nodeId.replace(/\s+/g, '')}`);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#ffffff");
    text.setAttribute("font-size", isGate || isZone ? "10" : "9");
    text.setAttribute("font-weight", "bold");
    text.textContent = nodeId;

    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  });
}

/**
 * Animate BFS on Graph Visualizer
 */
let graphAnimTimeout = null;
function animateGraphTraversal(traversalType = 'BFS') {
  clearTimeout(graphAnimTimeout);

  const startNode = "Entrance";
  const order = traversalType === 'BFS'
    ? parkingFacilityGraph.bfs(startNode)
    : parkingFacilityGraph.dfs(startNode);

  const statusBox = document.getElementById('graph-traversal-info');
  if (statusBox) {
    statusBox.innerHTML = `<strong>Running ${traversalType}:</strong> Starting from <code>${startNode}</code>...`;
  }

  // Reset all nodes
  document.querySelectorAll('.graph-node-group circle').forEach(c => {
    c.setAttribute('fill', '#1e293b');
    c.setAttribute('stroke', '#38bdf8');
  });

  let step = 0;
  function nextStep() {
    if (step >= order.length) {
      if (statusBox) {
        statusBox.innerHTML = `<strong>${traversalType} Complete:</strong> Visited ${order.length} nodes: <code>${order.join(' ➔ ')}</code>`;
      }
      return;
    }

    const current = order[step];
    const circleId = `circle-${current.replace(/\s+/g, '')}`;
    const circle = document.getElementById(circleId);

    if (circle) {
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', '#34d399');
    }

    if (statusBox) {
      statusBox.innerHTML = `<strong>${traversalType} Step ${step + 1}/${order.length}:</strong> Visiting <code>${current}</code>`;
    }

    step++;
    graphAnimTimeout = setTimeout(nextStep, 450);
  }

  nextStep();
}

// =============================================================================
// 14. SEARCH & SORT INTERACTIVE LABORATORY
// =============================================================================

/**
 * Execute Search (Linear vs Binary)
 */
function handleRunSearch() {
  const target = document.getElementById('search-target-input').value.trim().toUpperCase();
  const algo = document.getElementById('search-algo-select').value;
  const stage = document.getElementById('search-visual-stage');
  const metricAlgo = document.getElementById('search-metric-algo');
  const metricTarget = document.getElementById('search-metric-target');
  const metricComps = document.getElementById('search-metric-comps');
  const metricRes = document.getElementById('search-metric-res');
  const metricComp = document.getElementById('search-metric-comp');
  const stepExpl = document.getElementById('search-step-explanation');

  if (!target) {
    showToast('Invalid Input', 'Please enter a Slot ID to search.', 'warning');
    return;
  }

  metricTarget.textContent = target;

  if (algo === 'linear') {
    metricAlgo.textContent = 'Linear Search';
    metricComp.textContent = 'O(n)';
    const result = linearSearch(parkingSlots, 'id', target);

    metricComps.textContent = result.comparisons;
    metricRes.textContent = result.found ? `Found at index [${result.index}]` : 'Not Found';
    metricRes.style.color = result.found ? '#34d399' : '#f87171';

    // Render cells
    stage.innerHTML = '';
    parkingSlots.forEach((s, idx) => {
      const cell = document.createElement('div');
      cell.className = 'search-cell';
      cell.textContent = s.id;
      if (result.found && idx === result.index) {
        cell.classList.add('matched');
      } else if (idx < result.comparisons) {
        cell.classList.add('comparing');
      }
      stage.appendChild(cell);
    });

    stepExpl.textContent = result.found
      ? `Sequential scan checked ${result.comparisons} slot(s) before finding ${target} at index [${result.index}]. Time complexity: O(n).`
      : `Scanned all ${result.comparisons} slots. Target ${target} was not found. Worst case: O(n).`;

  } else {
    // Binary Search requires sorted array
    metricAlgo.textContent = 'Binary Search';
    metricComp.textContent = 'O(log n)';

    // Sort by id for binary search
    const sortedSlots = [...parkingSlots].sort((a, b) => a.id.localeCompare(b.id));
    const result = binarySearch(sortedSlots, 'id', target);

    metricComps.textContent = result.comparisons;
    metricRes.textContent = result.found ? `Found at index [${result.index}]` : 'Not Found';
    metricRes.style.color = result.found ? '#34d399' : '#f87171';

    stage.innerHTML = '';
    sortedSlots.forEach((s, idx) => {
      const cell = document.createElement('div');
      cell.className = 'search-cell';
      cell.textContent = s.id;
      if (result.found && idx === result.index) {
        cell.classList.add('matched');
      }
      stage.appendChild(cell);
    });

    stepExpl.textContent = result.found
      ? `Binary search halved the search space on each step, finding ${target} in only ${result.comparisons} comparison(s)! O(log n) efficiency.`
      : `Binary search concluded in ${result.comparisons} steps that ${target} is not in the array. O(log n).`;
  }
}

/**
 * Sorting Visualization State
 */
let sortAnimationRunning = false;
let sortArrayData = [];

function initSortArray() {
  sortArrayData = parkingSlots.slice(0, 14).map(s => ({
    id: s.id,
    distance: s.distance
  }));
  renderSortBars(sortArrayData);
}

function renderSortBars(arr, activeIndices = [], type = '') {
  const container = document.getElementById('sort-bars-container');
  if (!container) return;

  const maxVal = Math.max(...arr.map(x => x.distance), 90);
  container.innerHTML = '';

  arr.forEach((item, idx) => {
    const bar = document.createElement('div');
    bar.className = 'sort-bar';
    const heightPercent = (item.distance / maxVal) * 100;
    bar.style.height = `${Math.max(15, heightPercent)}%`;
    bar.textContent = `${item.distance}m`;

    if (activeIndices.includes(idx)) {
      if (type === 'COMPARE') bar.classList.add('comparing');
      if (type === 'SWAP') bar.classList.add('swapping');
    }

    if (type === 'DONE') {
      bar.classList.add('sorted');
    }

    container.appendChild(bar);
  });
}

function handleStartSort() {
  if (sortAnimationRunning) return;

  const algo = document.getElementById('sort-algo-select').value;
  const speed = parseInt(document.getElementById('sort-speed-select').value, 10) || 300;
  const stepMetric = document.getElementById('sort-metric-step');
  const compMetric = document.getElementById('sort-metric-comps');
  const swapMetric = document.getElementById('sort-metric-swaps');
  const statusMetric = document.getElementById('sort-metric-status');
  const stepExpl = document.getElementById('sort-step-explanation');

  sortAnimationRunning = true;
  statusMetric.textContent = 'Sorting in progress...';
  statusMetric.style.color = '#f59e0b';

  const result = algo === 'bubble'
    ? bubbleSort(sortArrayData, 'distance')
    : selectionSort(sortArrayData, 'distance');

  let stepIdx = 0;
  function playStep() {
    if (stepIdx >= result.steps.length) {
      sortAnimationRunning = false;
      statusMetric.textContent = 'Sorted!';
      statusMetric.style.color = '#10b981';
      stepExpl.textContent = `Completed ${algo === 'bubble' ? 'Bubble' : 'Selection'} Sort in ${result.totalComparisons} comparisons and ${result.totalSwaps} swaps. Time complexity: O(n²).`;
      return;
    }

    const currentStep = result.steps[stepIdx];
    stepMetric.textContent = currentStep.pass;
    compMetric.textContent = currentStep.comparisons;
    swapMetric.textContent = currentStep.swaps;

    renderSortBars(currentStep.array, currentStep.indices, currentStep.type);
    stepIdx++;
    setTimeout(playStep, speed);
  }

  playStep();
}

function handleShuffleSort() {
  if (sortAnimationRunning) return;
  // Fisher-Yates shuffle
  for (let i = sortArrayData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sortArrayData[i], sortArrayData[j]] = [sortArrayData[j], sortArrayData[i]];
  }
  renderSortBars(sortArrayData);
  document.getElementById('sort-metric-step').textContent = '0';
  document.getElementById('sort-metric-comps').textContent = '0';
  document.getElementById('sort-metric-swaps').textContent = '0';
  document.getElementById('sort-metric-status').textContent = 'Shuffled';
  document.getElementById('sort-metric-status').style.color = '#38bdf8';
}

// =============================================================================
// 15. MODALS & DIRECT ACTIONS
// =============================================================================

function openSlotModal(slotId) {
  const slot = parkingSlots.find(s => s.id === slotId);
  if (!slot) return;

  const modal = document.getElementById('slot-modal');
  const title = document.getElementById('modal-slot-id');
  const chip = document.getElementById('modal-slot-chip');
  const body = document.getElementById('modal-slot-body');
  const footer = document.getElementById('modal-slot-footer');

  title.textContent = `Parking Bay ${slot.id}`;
  chip.className = `status-chip ${slot.status === 'available' ? 'chip-available' : 'chip-occupied'}`;
  chip.innerHTML = `<span class="status-dot ${slot.status === 'available' ? 'green' : 'red'}"></span> ${slot.status.toUpperCase()}`;

  let bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
      <div class="slot-detail-row"><span class="k">Zone:</span> <span class="v">Zone ${slot.zone}</span></div>
      <div class="slot-detail-row"><span class="k">Distance from Entrance:</span> <span class="v">${slot.distance} meters</span></div>
  `;

  if (slot.status === 'occupied' && slot.vehicle) {
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - slot.vehicle.timestamp) / 60000));
    const fee = Math.max(30, Math.ceil(elapsedMinutes / 60) * 40);
    bodyHtml += `
      <hr style="border-color:var(--border-color); margin:8px 0;">
      <div class="slot-detail-row"><span class="k">Vehicle Plate:</span> <span class="v plate">${slot.vehicle.regNo}</span></div>
      <div class="slot-detail-row"><span class="k">Vehicle Type:</span> <span class="v">${slot.vehicle.vehicleType}</span></div>
      <div class="slot-detail-row"><span class="k">Driver Name:</span> <span class="v">${slot.vehicle.driverName}</span></div>
      <div class="slot-detail-row"><span class="k">Entry Time:</span> <span class="v">${slot.vehicle.entryTime}</span></div>
      <div class="slot-detail-row"><span class="k">Parked Duration:</span> <span class="v">${elapsedMinutes} min</span></div>
      <div class="slot-detail-row"><span class="k">Current Billable Fee:</span> <strong class="text-emerald" style="font-size:1.1rem;">₹${fee}</strong></div>
    `;
  }
  bodyHtml += `</div>`;
  body.innerHTML = bodyHtml;

  footer.innerHTML = '';
  if (slot.status === 'available') {
    footer.innerHTML = `
      <button class="btn btn-outline-light" onclick="closeModal()">Cancel</button>
      <button class="btn btn-emerald" onclick="openParkModalForSlot('${slot.id}')">Park Vehicle Here</button>
    `;
  } else {
    footer.innerHTML = `
      <button class="btn btn-outline-light" onclick="closeModal()">Close</button>
      <button class="btn btn-danger" onclick="handleDirectExit('${slot.vehicle.regNo}')">Process Exit</button>
    `;
  }

  modal.classList.add('show');
}

function openParkModalForSlot(slotId) {
  closeModal();
  switchPage('entry-exit');
  document.getElementById('entry-slot-mode').value = 'MANUAL';
  document.getElementById('manual-slot-group').style.display = 'block';
  document.getElementById('entry-manual-slot').value = slotId;
}

function closeModal() {
  const modal = document.getElementById('slot-modal');
  if (modal) modal.classList.remove('show');
}

function handleDirectExit(regNo) {
  closeModal();
  const res = exitVehicle(regNo);
  if (res.success) {
    showToast(
      'Vehicle Exited',
      `Vehicle ${res.vehicle.regNo} has exited Bay ${res.slotId}. Fee: ₹${res.fee}. Duration: ${res.durationMinutes} min.`,
      'success'
    );

    if (res.promotedWaitingCar) {
      setTimeout(() => {
        showToast(
          'Queue Handoff (FIFO)',
          `Waiting vehicle ${res.promotedWaitingCar.regNo} was automatically assigned newly freed Bay ${res.slotId}!`,
          'info'
        );
      }, 700);
    }
  } else {
    showToast('Exit Failed', res.message, 'danger');
  }
}

// =============================================================================
// 16. PAGE NAVIGATION
// =============================================================================

function switchPage(pageId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageId}`);
  const targetLink = document.getElementById(`nav-${pageId}`);

  if (targetPage) targetPage.classList.add('active');
  if (targetLink) targetLink.classList.add('active');

  const titles = {
    'dashboard': { title: 'Dashboard', sub: 'Real-time Smart Parking Overview & DSA State' },
    'slots': { title: 'Parking Slots Grid', sub: 'Array representation with 24 individual parking bays' },
    'smart': { title: 'Smart Recommendation', sub: 'Graph BFS + Min-Heap Priority Queue Engine' },
    'entry-exit': { title: 'Vehicle Entry & Exit', sub: 'Fast vehicle admission, O(1) hash table lookup & exit' },
    'visualizer': { title: 'DSA Visualizer', sub: 'Interactive demonstration of all 8 core Data Structures' },
    'search-sort': { title: 'Search & Sort Lab', sub: 'Linear, Binary Search & Bubble, Selection Sort animations' },
    'history': { title: 'Parking History', sub: 'Complete LocalStorage audit log of all parking actions' },
    'about-dsa': { title: 'About DSA / Viva Prep', sub: 'College Viva Voce reference & theoretical defense guide' }
  };

  const headerTitle = document.getElementById('page-title');
  const headerSub = document.getElementById('page-subtitle');
  if (headerTitle && titles[pageId]) headerTitle.textContent = titles[pageId].title;
  if (headerSub && titles[pageId]) headerSub.textContent = titles[pageId].sub;

  // Mobile sidebar auto-close
  document.getElementById('app-sidebar')?.classList.remove('show-mobile');
}

// =============================================================================
// 17. DEMO DATA & RESET SYSTEM
// =============================================================================

const DEMO_VEHICLES = [
  { regNo: "DL-01-AB-1234", vehicleType: "Sedan", driverName: "Aarav Sharma", slotId: "A1" },
  { regNo: "MH-12-CD-5678", vehicleType: "SUV", driverName: "Pooja Hegde", slotId: "A3" },
  { regNo: "KA-05-EF-9012", vehicleType: "EV", driverName: "Rohan Varma", slotId: "D1" },
  { regNo: "HR-26-GH-3456", vehicleType: "Hatchback", driverName: "Kavita Singh", slotId: "B2" },
  { regNo: "UP-32-IJ-7890", vehicleType: "Bike", driverName: "Nitin Mehra", slotId: "C1" },
  { regNo: "WB-02-KL-2345", vehicleType: "Sedan", driverName: "Ananya Roy", slotId: "B5" },
  { regNo: "TN-09-MN-6789", vehicleType: "SUV", driverName: "Siddharth Rao", slotId: "C4" }
];

const DEMO_WAITING = [
  { regNo: "TS-07-OP-1122", vehicleType: "Sedan", driverName: "Vikram Reddy", preferredZone: "A" },
  { regNo: "GJ-01-QR-3344", vehicleType: "EV", driverName: "Sneha Patel", preferredZone: "D" }
];

function loadDemoData() {
  resetParkingSystem(false);

  DEMO_VEHICLES.forEach(veh => {
    parkVehicle(veh, veh.slotId);
  });

  DEMO_WAITING.forEach(waitCar => {
    enqueueWaitingVehicle(waitCar);
  });

  showToast('Demo Data Loaded', 'Sample vehicles and waiting queue populated successfully!', 'success');
}

function resetParkingSystem(showNotice = true) {
  parkingSlots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
  activeVehiclesList.clear();
  waitingQueue.clear();
  recentOperationsStack.clear();
  vehicleHashMap.clear();
  smartMinHeap.clear();
  parkingHistory = [];

  localStorage.removeItem(STORAGE_KEYS.SLOTS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.WAITING);
  localStorage.removeItem(STORAGE_KEYS.STACK);

  rebuildBST();
  updateUI();

  if (showNotice) {
    showToast('System Reset', 'All parking data and LocalStorage cleared!', 'info');
  }
}

// =============================================================================
// 18. DOM EVENT LISTENERS SETUP
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initParkingGraph();
  loadStateFromLocalStorage();
  initSortArray();
  updateUI();

  // Navigation Links
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) switchPage(page);
    });
  });

  // Mobile Hamburger Toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('app-sidebar')?.classList.toggle('show-mobile');
  });

  // Header Quick Park Button
  document.getElementById('btn-quick-park-modal')?.addEventListener('click', () => {
    switchPage('entry-exit');
  });

  // Banner Actions
  document.getElementById('btn-banner-find-slot')?.addEventListener('click', () => {
    switchPage('smart');
  });

  document.getElementById('btn-banner-view-dsa')?.addEventListener('click', () => {
    switchPage('visualizer');
  });

  // Dashboard Zone Filter Tabs
  document.getElementById('dash-zone-tabs')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      document.querySelectorAll('#dash-zone-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderDashboardSlots(e.target.dataset.zone);
    }
  });

  // Slots Page Filters
  document.getElementById('slots-filter-zone')?.addEventListener('change', renderFullSlotsGrid);
  document.getElementById('slots-filter-status')?.addEventListener('change', renderFullSlotsGrid);

  // Smart Recommender Actions
  document.getElementById('btn-quick-fill-sample')?.addEventListener('click', () => {
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const plates = [`DL-03-TC-${randDigits}`, `MH-02-XY-${randDigits}`, `KA-01-MJ-${randDigits}`, `HR-29-PQ-${randDigits}`];
    const names = ["Aditya Kapoor", "Sunil Gavaskar", "Meera Sen", "Priya Nair"];
    const types = ["Sedan", "SUV", "EV", "Bike"];
    const zones = ["ANY", "A", "B", "C", "D"];

    document.getElementById('smart-vehicle-num').value = plates[Math.floor(Math.random() * plates.length)];
    document.getElementById('smart-driver-name').value = names[Math.floor(Math.random() * names.length)];
    document.getElementById('smart-vehicle-type').value = types[Math.floor(Math.random() * types.length)];
    document.getElementById('smart-zone-pref').value = zones[Math.floor(Math.random() * zones.length)];
  });

  document.getElementById('btn-run-smart-recommendation')?.addEventListener('click', () => {
    const regNo = document.getElementById('smart-vehicle-num').value.trim().toUpperCase();
    const vType = document.getElementById('smart-vehicle-type').value;
    const dName = document.getElementById('smart-driver-name').value.trim();
    const zonePref = document.getElementById('smart-zone-pref').value;

    if (!regNo) {
      showToast('Validation Error', 'Please enter a vehicle registration number.', 'warning');
      return;
    }

    const { bestSlot, score, logSteps } = findBestSlot({ preferredZone: zonePref, vehicleType: vType });

    // Output logs
    const logBox = document.getElementById('smart-log-text');
    if (logBox) {
      logBox.innerHTML = logSteps.map(line => `<div class="log-line cyan">> ${line}</div>`).join('');
    }

    const resultBox = document.getElementById('smart-result-box');
    if (!bestSlot) {
      resultBox.innerHTML = `
        <div class="rec-empty-state" style="color:var(--color-danger);">
          <h4>Parking Lot is 100% Full!</h4>
          <p>No reachable slots are available. Click below to add vehicle to waiting queue (FIFO).</p>
          <button class="btn btn-outline-cyan" onclick="handleQueueFromSmart('${regNo}', '${vType}', '${dName}', '${zonePref}')">
            Enqueue to Waiting Queue
          </button>
        </div>
      `;
      return;
    }

    // Highlight recommendation
    resultBox.innerHTML = `
      <div class="rec-success-card">
        <div>
          <div class="rec-slot-huge">${bestSlot.id}</div>
          <span class="rec-score-badge">Min-Heap Score: ${score}</span>
        </div>
        <div class="rec-meta-details">
          <h4>Recommended Bay: ${bestSlot.id} (Zone ${bestSlot.zone})</h4>
          <p>Distance from Entrance: <strong>${bestSlot.distance} meters</strong></p>
          <p>Optimal match computed via Graph BFS traversal & Min-Heap priority queue.</p>
          <button class="btn btn-emerald btn-lg" style="margin-top:12px;" onclick="confirmSmartPark('${regNo}', '${vType}', '${dName}', '${bestSlot.id}')">
            Confirm & Park in Slot ${bestSlot.id}
          </button>
        </div>
      </div>
    `;

    showToast('Slot Recommended', `Min-Heap selected Slot ${bestSlot.id} as the optimal bay!`, 'success');
  });

  document.getElementById('btn-clear-smart-log')?.addEventListener('click', () => {
    const logBox = document.getElementById('smart-log-text');
    if (logBox) logBox.innerHTML = '<div class="log-line info">> Log cleared. Ready for next algorithm execution.</div>';
  });

  // Entry Form Handlers
  document.getElementById('entry-slot-mode')?.addEventListener('change', (e) => {
    const manualGroup = document.getElementById('manual-slot-group');
    if (manualGroup) {
      manualGroup.style.display = e.target.value === 'MANUAL' ? 'block' : 'none';
    }
  });

  document.getElementById('form-vehicle-entry')?.addEventListener('submit', () => {
    const regNo = document.getElementById('entry-reg-no').value.trim().toUpperCase();
    const type = document.getElementById('entry-type').value;
    const driver = document.getElementById('entry-driver').value.trim();
    const mode = document.getElementById('entry-slot-mode').value;

    if (!regNo) {
      showToast('Validation Error', 'Vehicle registration number is required.', 'warning');
      return;
    }

    let targetSlot = null;
    if (mode === 'MANUAL') {
      targetSlot = document.getElementById('entry-manual-slot').value;
      if (!targetSlot) {
        showToast('Selection Error', 'Please choose an available slot.', 'warning');
        return;
      }
    } else {
      const rec = findBestSlot({ vehicleType: type });
      if (!rec.bestSlot) {
        // Enqueue if full
        const qRes = enqueueWaitingVehicle({ regNo, vehicleType: type, driverName: driver });
        if (qRes.success) {
          showToast('Parking Full', `Vehicle added to waiting queue at position #${qRes.position}.`, 'warning');
          document.getElementById('form-vehicle-entry').reset();
        } else {
          showToast('Error', qRes.message, 'danger');
        }
        return;
      }
      targetSlot = rec.bestSlot.id;
    }

    const res = parkVehicle({ regNo, vehicleType: type, driverName: driver }, targetSlot);
    if (res.success) {
      showToast('Vehicle Parked', `Vehicle ${regNo} successfully parked in Slot ${targetSlot}!`, 'success');
      document.getElementById('form-vehicle-entry').reset();
    } else {
      showToast('Parking Error', res.message, 'danger');
    }
  });

  // Exit Form Handlers
  document.getElementById('btn-lookup-exit')?.addEventListener('click', () => {
    const regNo = document.getElementById('exit-reg-no').value.trim().toUpperCase();
    if (!regNo) {
      showToast('Lookup Error', 'Please enter a vehicle registration plate.', 'warning');
      return;
    }

    const lookup = vehicleHashMap.get(regNo);
    const previewBox = document.getElementById('exit-preview-details');

    if (!lookup.found) {
      showToast('Not Found', `Vehicle ${regNo} was not found in active parked vehicles. Checked via Hash Map in ${lookup.comparisons} comparisons.`, 'danger');
      if (previewBox) previewBox.style.display = 'none';
      return;
    }

    const veh = lookup.value;
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - veh.timestamp) / 60000));
    const fee = Math.max(30, Math.ceil(elapsedMinutes / 60) * 40);

    document.getElementById('exit-prev-plate').textContent = veh.regNo;
    document.getElementById('exit-prev-slot').textContent = `Slot ${veh.slotId} (Zone ${veh.zone})`;
    document.getElementById('exit-prev-entry').textContent = veh.entryTime;
    document.getElementById('exit-prev-duration').textContent = `${elapsedMinutes} minutes`;
    document.getElementById('exit-prev-fee').textContent = `₹${fee}`;

    if (previewBox) previewBox.style.display = 'flex';
    showToast('Vehicle Located', `O(1) Hash Map lookup found vehicle in bucket [${lookup.bucketIndex}]!`, 'info');
  });

  document.getElementById('form-vehicle-exit')?.addEventListener('submit', () => {
    const regNo = document.getElementById('exit-reg-no').value.trim().toUpperCase();
    if (!regNo) return;
    handleDirectExit(regNo);
    document.getElementById('form-vehicle-exit').reset();
    const previewBox = document.getElementById('exit-preview-details');
    if (previewBox) previewBox.style.display = 'none';
  });

  // Active vehicles search filter
  document.getElementById('active-vehicles-search')?.addEventListener('input', renderActiveVehiclesTable);

  // Visualizer Tab Switching
  document.getElementById('viz-tabs-nav')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('vtab-btn')) {
      document.querySelectorAll('#viz-tabs-nav .vtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.viz-view').forEach(v => v.classList.remove('active'));

      e.target.classList.add('active');
      const targetViz = document.getElementById(`viz-view-${e.target.dataset.viz}`);
      if (targetViz) targetViz.classList.add('active');
    }
  });

  // Visualizer Specific Action Buttons
  document.getElementById('btn-viz-enqueue-dummy')?.addEventListener('click', () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    enqueueWaitingVehicle({ regNo: `TEST-${rand}`, vehicleType: "Sedan", driverName: "Test Driver" });
    showToast('Enqueued', `Added TEST-${rand} to waiting queue.`, 'info');
  });

  document.getElementById('btn-viz-dequeue-dummy')?.addEventListener('click', () => {
    if (waitingQueue.isEmpty()) {
      showToast('Queue Empty', 'No vehicles waiting to dequeue.', 'warning');
      return;
    }
    const dequeued = waitingQueue.dequeue();
    saveStateToLocalStorage();
    updateUI();
    showToast('Dequeued', `Removed front vehicle ${dequeued.regNo} from waiting queue.`, 'info');
  });

  document.getElementById('btn-viz-pop-stack')?.addEventListener('click', () => {
    if (recentOperationsStack.isEmpty()) {
      showToast('Stack Empty', 'No operations left on stack.', 'warning');
      return;
    }
    const popped = recentOperationsStack.pop();
    saveStateToLocalStorage();
    updateUI();
    showToast('Popped Operation', `Popped [${popped.action}] ${popped.regNo} from Stack TOP.`, 'info');
  });

  document.getElementById('btn-hashmap-test-hash')?.addEventListener('click', () => {
    const input = document.getElementById('hashmap-test-key').value.trim().toUpperCase();
    if (!input) return;
    const bucket = vehicleHashMap.hash(input);
    const lookup = vehicleHashMap.get(input);
    const out = document.getElementById('hash-calc-output');
    out.textContent = `Hash("${input}") % 11 = Bucket [${bucket}] | ${lookup.found ? 'Found in chain!' : 'Not in registry'}`;
  });

  document.getElementById('btn-bst-inorder')?.addEventListener('click', () => {
    const inorderNodes = slotsBST.inorderTraversal();
    const out = document.getElementById('bst-traversal-res');
    out.textContent = `Inorder: ${inorderNodes.map(n => `${n.slotData.id}(${n.key}m)`).join(' ➔ ')}`;
    showToast('BST Traversal', 'Inorder traversal completed in sorted ascending distance order.', 'info');
  });

  document.getElementById('btn-heap-rebuild')?.addEventListener('click', () => {
    smartMinHeap.clear();
    parkingSlots.filter(s => s.status === 'available').forEach(s => {
      smartMinHeap.insert({
        slotId: s.id,
        score: s.distance,
        distance: s.distance,
        zone: s.zone
      });
    });
    renderMinHeapVisualizer();
    showToast('Heap Rebuilt', 'Min-Heap rebuilt from all available slots.', 'success');
  });

  document.getElementById('btn-heap-extract')?.addEventListener('click', () => {
    const min = smartMinHeap.extractMin();
    if (!min) {
      showToast('Heap Empty', 'No elements in heap to extract.', 'warning');
      return;
    }
    renderMinHeapVisualizer();
    showToast('extractMin()', `Extracted root min element: Bay ${min.slotId} (Score: ${min.score}) in O(log n) time.`, 'info');
  });

  // Graph Traversal Animation Buttons
  document.getElementById('btn-graph-run-bfs')?.addEventListener('click', () => {
    animateGraphTraversal('BFS');
  });

  document.getElementById('btn-graph-run-dfs')?.addEventListener('click', () => {
    animateGraphTraversal('DFS');
  });

  document.getElementById('btn-graph-reset')?.addEventListener('click', () => {
    clearTimeout(graphAnimTimeout);
    renderGraphVisualizer();
    document.getElementById('graph-traversal-info').innerHTML = '<strong>Traversal State:</strong> Reset.';
  });

  // Search & Sort Event Listeners
  document.getElementById('btn-run-search')?.addEventListener('click', handleRunSearch);
  document.getElementById('btn-run-sort')?.addEventListener('click', handleStartSort);
  document.getElementById('btn-shuffle-sort')?.addEventListener('click', handleShuffleSort);

  // History Actions
  document.getElementById('history-filter-action')?.addEventListener('change', renderHistoryTable);

  document.getElementById('btn-export-history')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parkingHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `parkwise_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  document.getElementById('btn-clear-history')?.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the parking history log?")) {
      parkingHistory = [];
      saveStateToLocalStorage();
      renderHistoryTable();
      showToast('History Cleared', 'Parking operations history log has been cleared.', 'info');
    }
  });

  // Modal Close Listeners
  document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
  document.getElementById('slot-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'slot-modal') closeModal();
  });

  // Global Demo / Reset Buttons
  document.getElementById('btn-load-demo')?.addEventListener('click', loadDemoData);
  document.getElementById('btn-reset-system')?.addEventListener('click', () => {
    if (confirm("Reset all parking slots and local storage data?")) {
      resetParkingSystem(true);
    }
  });
});

// Global window bindings for inline HTML onclick handlers
window.handleDirectExit = handleDirectExit;
window.openParkModalForSlot = openParkModalForSlot;
window.closeModal = closeModal;

// Helper for Smart Recommender 1-Click Confirmation
window.confirmSmartPark = function(regNo, type, driver, slotId) {
  const res = parkVehicle({ regNo, vehicleType: type, driverName: driver }, slotId);
  if (res.success) {
    showToast('Success', `Vehicle ${regNo} parked in Recommended Slot ${slotId}!`, 'success');
    switchPage('dashboard');
  } else {
    showToast('Error', res.message, 'danger');
  }
};

window.handleQueueFromSmart = function(regNo, type, driver, prefZone) {
  const res = enqueueWaitingVehicle({ regNo, vehicleType: type, driverName: driver, preferredZone: prefZone });
  if (res.success) {
    showToast('Queued', `Vehicle added to waiting queue at position #${res.position}.`, 'warning');
    switchPage('dashboard');
  }
};
