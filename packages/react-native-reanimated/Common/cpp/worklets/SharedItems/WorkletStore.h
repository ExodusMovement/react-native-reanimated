//
//  WorkletMap.h
//  Pods
//
//  Created by Alexander Pataridze on 29.03.25.
//

#pragma once // Prevents multiple inclusions of the header

#include <string>
#include <unordered_map> // Efficient hash-based map
#include <mutex>         // For thread safety
#include <optional>      // To safely return values that might not exist
#include <shared_mutex>  // For potential read-write optimization (optional)

// A thread-safe singleton class for storing key-value pairs (string -> string).
class WorkletStore {
public:
    // --- Singleton Access ---

    /**
     * @brief Gets the single instance of the WorkletStore. Thread-safe initialization.
     * @return Reference to the WorkletStore instance.
     */
    static WorkletStore& getInstance();

    // --- Deleted Constructors/Assignments (Singleton Pattern) ---
    // Prevent copying and moving to enforce single instance
    WorkletStore(const WorkletStore&) = delete;
    WorkletStore& operator=(const WorkletStore&) = delete;
    WorkletStore(WorkletStore&&) = delete;
    WorkletStore& operator=(WorkletStore&&) = delete;

    // --- Public Interface ---

    /**
     * @brief Sets (inserts or updates) the value for a given key. Thread-safe.
     * @param key The key to set.
     * @param value The value to associate with the key.
     */
    void set(double key, const std::string& value);

    /**
     * @brief Gets the value associated with a given key. Thread-safe.
     * @param key The key to look up.
     * @return An std::optional<std::string> containing the value if the key exists,
     * otherwise std::nullopt.
     */
    std::string get(double key) const; // const because it reads

    /**
     * @brief Removes a key-value pair from the store. Thread-safe.
     * @param key The key to remove.
     * @return true if an element was removed, false otherwise.
     */
    bool remove(double key);

    /**
     * @brief Checks if the store contains a specific key. Thread-safe.
     * @param key The key to check for.
     * @return true if the key exists, false otherwise.
     */
    bool contains(double key) const; // const because it reads

    /**
     * @brief Removes all key-value pairs from the store. Thread-safe.
     */
    void clear();

    /**
     * @brief Gets the number of key-value pairs currently in the store. Thread-safe.
     * @return The number of elements.
     */
    size_t size() const; // const because it reads

private:
    // --- Private Members ---

    // Private constructor: enforce singleton access via getInstance()
    WorkletStore() = default;

    // Private destructor (can be defaulted if no special cleanup needed)
   ~WorkletStore() = default;

    // The underlying map storing the data
    std::unordered_map<double, std::string> store_;

    // Mutex to protect access to the store_ map from concurrent threads.
    // 'mutable' allows locking even in 'const' methods like get() and contains().
    mutable std::mutex storeMutex_;

    // --- Optional Optimization (Advanced) ---
    // For high-contention scenarios with many more reads than writes,
    // a std::shared_mutex can sometimes offer better performance.
    // mutable std::shared_mutex storeSharedMutex_;
    // Use std::lock_guard<std::shared_mutex> for writes (exclusive lock).
    // Use std::shared_lock<std::shared_mutex> for reads (shared lock).
    // For simplicity, we'll stick with the standard std::mutex here.
};
