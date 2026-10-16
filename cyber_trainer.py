"""A small, beginner-friendly cybersecurity learning trainer."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Question:
    prompt: str
    choices: tuple[str, ...]
    answer_index: int
    explanation: str


@dataclass(frozen=True)
class Lesson:
    title: str
    summary: str
    key_points: tuple[str, ...]
    questions: tuple[Question, ...]


LESSONS = (
    Lesson(
        title="Spotting phishing",
        summary="Phishing messages try to trick people into sharing information or opening unsafe links.",
        key_points=(
            "Check the sender and the real destination of links before acting.",
            "Unexpected urgency or requests for passwords are warning signs.",
            "When unsure, contact the organization using a known, trusted channel.",
        ),
        questions=(
            Question(
                prompt="An unexpected email asks you to confirm your password immediately. What should you do?",
                choices=(
                    "Reply with your password",
                    "Use a trusted channel to check whether the request is real",
                    "Forward it to everyone",
                ),
                answer_index=1,
                explanation="Verify unusual requests through a contact method you already trust.",
            ),
        ),
    ),
    Lesson(
        title="Safer passwords",
        summary="Unique, hard-to-guess passwords help limit the damage if one account is exposed.",
        key_points=(
            "Use a different password for each account.",
            "A password manager can create and store strong passwords.",
            "Turn on multi-factor authentication when it is available.",
        ),
        questions=(
            Question(
                prompt="Why should accounts have unique passwords?",
                choices=(
                    "It prevents one exposed password from unlocking other accounts",
                    "It makes passwords easier to remember",
                    "It means multi-factor authentication is unnecessary",
                ),
                answer_index=0,
                explanation="Unique passwords reduce the risk of attackers reusing exposed credentials.",
            ),
        ),
    ),
    Lesson(
        title="Understanding file hashes",
        summary="A cryptographic hash is a fixed-length value used to check whether data has changed.",
        key_points=(
            "The same file contents produce the same hash with the same algorithm.",
            "A small change to the file usually produces a very different hash.",
            "A hash can help check integrity, but it does not encrypt or hide a file.",
        ),
        questions=(
            Question(
                prompt="What is a cryptographic hash useful for?",
                choices=(
                    "Recovering the original file contents",
                    "Checking whether file contents have changed",
                    "Encrypting a file so nobody can read it",
                ),
                answer_index=1,
                explanation="Hashes can be compared to detect changes; they are not encryption.",
            ),
        ),
    ),
    Lesson(
        title="Reading security logs",
        summary="Logs record events that can help explain what happened on a system.",
        key_points=(
            "Look for unusual times, repeated failures, or activity that does not fit normal use.",
            "A single event may have an ordinary explanation; check context before drawing conclusions.",
            "Keep logs private and share them only with authorized people.",
        ),
        questions=(
            Question(
                prompt="A log shows one failed sign-in. What is a sensible first step?",
                choices=(
                    "Assume the system is compromised",
                    "Check surrounding events and whether the activity is unusual",
                    "Delete the logs",
                ),
                answer_index=1,
                explanation="Context helps distinguish routine mistakes from a pattern that needs attention.",
            ),
        ),
    ),
)


def _read_choice(prompt: str, minimum: int, maximum: int, input_fn, output_fn) -> int | None:
    """Read a numbered selection; return None when the user enters q."""
    while True:
        value = input_fn(prompt).strip().lower()
        if value == "q":
            return None
        try:
            choice = int(value)
        except ValueError:
            output_fn(f"Enter a number from {minimum} to {maximum}, or q to go back.")
            continue
        if minimum <= choice <= maximum:
            return choice
        output_fn(f"Enter a number from {minimum} to {maximum}, or q to go back.")


def show_lesson(lesson: Lesson, input_fn=input, output_fn=print) -> None:
    output_fn(f"\n{lesson.title}\n{lesson.summary}")
    for point in lesson.key_points:
        output_fn(f"- {point}")
    input_fn("\nPress Enter to return to the menu.")


def take_quiz(lesson: Lesson, input_fn=input, output_fn=print) -> int:
    score = 0
    output_fn(f"\nQuiz: {lesson.title}")
    for question in lesson.questions:
        output_fn(f"\n{question.prompt}")
        for index, choice in enumerate(question.choices, start=1):
            output_fn(f"  {index}. {choice}")
        answer = _read_choice("Your answer (or q to stop): ", 1, len(question.choices), input_fn, output_fn)
        if answer is None:
            break
        if answer - 1 == question.answer_index:
            score += 1
            output_fn("Correct!")
        else:
            output_fn("Not quite.")
        output_fn(question.explanation)
    output_fn(f"\nScore: {score}/{len(lesson.questions)}")
    return score


def run(input_fn=input, output_fn=print) -> None:
    output_fn("Cybersecurity Basics Trainer")
    while True:
        output_fn("\nChoose a lesson:")
        for index, lesson in enumerate(LESSONS, start=1):
            output_fn(f"  {index}. {lesson.title}")
        output_fn("  0. Exit")
        selection = _read_choice("Selection: ", 0, len(LESSONS), input_fn, output_fn)
        if selection is None or selection == 0:
            output_fn("Goodbye!")
            return

        lesson = LESSONS[selection - 1]
        output_fn(f"\n1. Study: {lesson.title}\n2. Take its quiz\n0. Back")
        action = _read_choice("Selection: ", 0, 2, input_fn, output_fn)
        if action == 1:
            show_lesson(lesson, input_fn, output_fn)
        elif action == 2:
            take_quiz(lesson, input_fn, output_fn)


if __name__ == "__main__":
    run()
