package pl.edu.agh.dockerbuddy.model.metric

import lombok.ToString
import pl.edu.agh.dockerbuddy.model.alert.AlertType

@ToString
data class BasicMetric(
    val basicMetricType: BasicMetricType,
    val value: Long,
    var alertType: AlertType?
)