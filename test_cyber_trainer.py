import unittest

from cyber_trainer import LESSONS, Question, Lesson, run, take_quiz


class CyberTrainerTests(unittest.TestCase):
    def test_lessons_have_valid_quiz_answers(self):
        self.assertTrue(LESSONS)
        for lesson in LESSONS:
            self.assertTrue(lesson.questions)
            for question in lesson.questions:
                self.assertGreaterEqual(question.answer_index, 0)
                self.assertLess(question.answer_index, len(question.choices))

    def test_quiz_scores_correct_answer(self):
        lesson = Lesson(
            title="Test",
            summary="Summary",
            key_points=(),
            questions=(Question("Question?", ("No", "Yes"), 1, "Explanation."),),
        )
        answers = iter(("2",))
        output = []

        score = take_quiz(lesson, input_fn=lambda _prompt: next(answers), output_fn=output.append)

        self.assertEqual(score, 1)
        self.assertIn("Correct!", output)

    def test_menu_can_exit(self):
        answers = iter(("0",))
        output = []

        run(input_fn=lambda _prompt: next(answers), output_fn=output.append)

        self.assertEqual(output[-1], "Goodbye!")


if __name__ == "__main__":
    unittest.main()
