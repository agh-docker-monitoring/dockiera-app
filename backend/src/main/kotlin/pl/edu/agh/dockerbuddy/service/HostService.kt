package pl.edu.agh.dockerbuddy.service

import io.reactivex.internal.util.ExceptionHelper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import pl.edu.agh.dockerbuddy.inmemory.InMemory
import pl.edu.agh.dockerbuddy.model.HostWithSummary
import pl.edu.agh.dockerbuddy.model.entity.Host
import pl.edu.agh.dockerbuddy.repository.HostRepository
import javax.persistence.EntityNotFoundException

@Service
class HostService (
    private val hostRepository: HostRepository,
    private val inMemory: InMemory,
){
    private val logger = LoggerFactory.getLogger(HostService::class.java)

    fun addHost(host: Host): Host {
        logger.info("New host received. Attempting to add: $host")
        return hostRepository.save(host)
    }

    fun deleteHost(id: Long) {
        logger.info("Deleting host $id")
        if (!hostRepository.existsById(id)) throw EntityNotFoundException("Host $id does not exist")
        inMemory.deleteHost(id)
        return hostRepository.deleteById(id)
    }

    fun updateHost(id: Long, host: Host): Host {
        if (!hostRepository.existsById(id)) throw EntityNotFoundException("Host $id does not exist")
        logger.info("Host $id update: $host")
        host.id = id
        return hostRepository.save(host)
    }

    fun getHostsWithSummary(): List<HostWithSummary> {
        logger.info("Fetching all hosts with summary")
        val hostsWithSummary = mutableListOf<HostWithSummary>()
        val hosts = hostRepository.findAll()

        logger.info("Processing ${hosts.size} found hosts")
        for (host in hosts) {
            logger.debug("> $host")
            val hostSummary = inMemory.getHostSummary(host.id!!)
            logger.debug("Found newest host summary: $hostSummary")
            hostsWithSummary.add(
                HostWithSummary(
                    host.id!!,
                    host.hostName!!,
                    host.ip!!,
                    hostSummary
                )
            )
        }

        return hostsWithSummary.toList()
    }
}