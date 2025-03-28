//
//  WorkletStore.cpp
//  Pods
//
//  Created by Alexander Pataridze on 29.03.25.
//

#include "WorkletStore.h" // Include the header definition
#include <utility>        // For potential use of std::move if needed

// --- Singleton Implementation ---
// Provides the actual instance storage and retrieval logic.
// Meyers' Singleton pattern guarantees thread-safe initialization since C++11.
WorkletStore& WorkletStore::getInstance() {
    // The 'static' variable is initialized only once, the first time this function is called.
    static WorkletStore instance;
    return instance;
}

// --- Method Implementations ---

void WorkletStore::set(double key, const std::string& value) {
    // Acquire an exclusive lock that automatically releases when 'lock' goes out of scope.
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Insert or update the key-value pair in the map.
    store_[key] = value;
}

std::string WorkletStore::get(double key) const {
    // Acquire a lock (needed even for reading to prevent data races with writes).
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Find the key in the map.
    auto it = store_.find(key);
    if (it != store_.end()) {
        // Key found, return the value wrapped in std::optional.
        return it->second;
    }
    // Key not found, return an empty std::optional.
    return "";
}

bool WorkletStore::remove(double key) {
    // Acquire an exclusive lock.
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Attempt to erase the key. std::unordered_map::erase returns the number
    // of elements removed (0 or 1 for maps with unique keys).
    return store_.erase(key) > 0;
}

bool WorkletStore::contains(double key) const {
    // Acquire a lock.
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Check if the key exists. map::count returns 1 if the key exists, 0 otherwise.
    return store_.count(key) > 0;
    // Alternative: return store_.find(key) != store_.end();
}

void WorkletStore::clear() {
    // Acquire an exclusive lock.
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Remove all elements from the map.
    store_.clear();
}

size_t WorkletStore::size() const {
    // Acquire a lock.
    std::lock_guard<std::mutex> lock(storeMutex_);
    // Return the current number of elements in the map.
    return store_.size();
}
