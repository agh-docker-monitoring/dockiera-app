package pl.edu.agh.dockerbuddy

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import pl.edu.agh.dockerbuddy.model.entity.PercentMetricRule
import pl.edu.agh.dockerbuddy.model.entity.Host
import pl.edu.agh.dockerbuddy.model.enums.RuleType
import pl.edu.agh.dockerbuddy.repository.AbstractRuleRepository
import pl.edu.agh.dockerbuddy.repository.HostRepository
import javax.validation.Validation
import javax.validation.Validator
import kotlin.IllegalArgumentException

@DataJpaTest
@AutoConfigureTestDatabase
class ModelTests (
    @Autowired val hostRepository: HostRepository,
    @Autowired val abstractRuleRepository: AbstractRuleRepository
) {

    lateinit var validator: Validator

    @BeforeEach
    fun setUp() {
        val factory = Validation.buildDefaultValidatorFactory()
        validator = factory.validator
    }

    @Test
    fun hostNameTest() {
        val host = Host("")
        val violations = validator.validate(host)
        assertFalse(violations.isEmpty())
    }

    @ParameterizedTest
    @ValueSource(strings = ["192.168.1.1", "1.1.1.1", "255.255.255.255"])
    fun hostCorrectIPTest(ip: String) {
        val host = Host("host", ip)
        val violations = validator.validate(host)
        assertTrue(violations.isEmpty())
    }


    @ParameterizedTest
    @ValueSource(strings = ["", "999.999.999.999", "256.1.0.0"])
    fun hostIncorrectIPTest(ip: String) {
        val host = Host("host", ip)
        val violations = validator.validate(host)
        assertFalse(violations.isEmpty())
    }

    @Test
    fun hostRulesInitTest() {
        val host = Host("name", "192.168.1.1")
        assertTrue(host.hostPercentRules.isEmpty())
    }

    @Test
    fun createHostWithRule() {
        val host = Host(
            "name",
            "192.168.1.1",
            mutableSetOf(Mockito.mock(PercentMetricRule::class.java)))
        assertFalse(host.hostPercentRules.isEmpty())
    }

    @Test
    fun abstractRuleAlertLevelTest() {
        assertThrows(IllegalArgumentException::class.java, fun() {
            PercentMetricRule(RuleType.DISK_USAGE, 50, 10)
        })
    }

    @Test
    fun abstractRuleMinAlertLevelConstraintTest() {
        val abstractRule1 = PercentMetricRule(RuleType.DISK_USAGE, -1, 20)
        var violations = validator.validate(abstractRule1)
        assertFalse(violations.isEmpty())

        val abstractRule2 = PercentMetricRule(RuleType.DISK_USAGE, -2, -1)
        violations = validator.validate(abstractRule2)
        assertFalse(violations.isEmpty())
    }

    @Test
    fun abstractRuleMaxAlertLevelConstraintTest() {
        val abstractRule1 = PercentMetricRule(RuleType.DISK_USAGE, 50, 105)
        var violations = validator.validate(abstractRule1)
        assertFalse(violations.isEmpty())

        val abstractRule2 = PercentMetricRule(RuleType.DISK_USAGE, 105, 150)
        violations = validator.validate(abstractRule2)
        assertFalse(violations.isEmpty())
    }

    @Test
    fun saveHostToDBTest() {
        val host = Host("host", "192.168.1.55")
        hostRepository.save(host)
        assertEquals(host, hostRepository.findAll().first())
    }

    @Test
    fun saveAbstractRuleToDBTest() {
        val host = Host("host", "192.168.1.55")
        val abstractRule = PercentMetricRule(RuleType.DISK_USAGE, 50, 90)
        host.hostPercentRules.add(abstractRule)
        hostRepository.save(host) // AbstractRule is persisted when updated host is saved to DB
        assertEquals(abstractRule, abstractRuleRepository.findAll().first())
        assertEquals(abstractRule, hostRepository.findAll().first().hostPercentRules.first())
    }
}