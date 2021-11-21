package pl.edu.agh.dockerbuddy.model.enums

enum class RuleType {
    MEMORY_USAGE,
    DISK_USAGE,
    CPU_USAGE,
    NETWORK_IN,
    NETWORK_OUT;

    fun humanReadable(): String {
        return name.lowercase().replace('_', ' ')
    }
}