import unittest
from app import calculate_risk_level, get_mitigation_hint

class TestRiskLogic(unittest.TestCase):

    # test the risk level 
    def test_calculate_risk_level(self):
        # low (1-5)
        self.assertEqual(calculate_risk_level(1), "Low")
        self.assertEqual(calculate_risk_level(5), "Low")
        
        # medium (6-12)
        self.assertEqual(calculate_risk_level(6), "Medium")
        self.assertEqual(calculate_risk_level(12), "Medium")

        # high (13-18)
        self.assertEqual(calculate_risk_level(13), "High")
        self.assertEqual(calculate_risk_level(18), "High")

        # critical (19+)
        self.assertEqual(calculate_risk_level(19), "Critical")
        self.assertEqual(calculate_risk_level(25), "Critical")

    # test the mitigation hints
    def test_mitigation_hints(self):
        self.assertEqual(get_mitigation_hint("Critical"), "Immediate mitigation required")
        self.assertEqual(get_mitigation_hint("Low"), "Accept / monitor")
        self.assertEqual(get_mitigation_hint("Unknown"), "")

if __name__ == '__main__':
    unittest.main()