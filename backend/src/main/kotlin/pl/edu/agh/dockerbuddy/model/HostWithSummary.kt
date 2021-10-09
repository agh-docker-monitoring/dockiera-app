package pl.edu.agh.dockerbuddy.model

import lombok.ToString
import pl.edu.agh.dockerbuddy.model.entity.ContainerRule
import pl.edu.agh.dockerbuddy.model.entity.MetricRule
import pl.edu.agh.dockerbuddy.model.metric.HostSummary

@ToString
data class HostWithSummary(
    val id: Long,
    val hostName: String,
    val ip: String,
    val hostRules: MutableSet<MetricRule>,
    val containersRules: MutableSet<ContainerRule>,
    val hostSummary: HostSummary?
)