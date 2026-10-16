# Cybersecurity Basics Trainer

A beginner-friendly, defensive cybersecurity learning project. It includes a
visual browser guide and a Python command-line trainer.

## Visual guide

Open `index.html` in a browser. The guide runs locally without installation and
includes a simplified attack lifecycle, searchable attack topics, warning signs,
and practical defenses. It covers phishing, credential attacks, malware and
ransomware, denial of service, and on-path interception.

The page uses locally stored HTML, CSS, and JavaScript. It does not send data
anywhere. Its explanations are high-level and intended for awareness and
protection, not for carrying out attacks.

## Requirements

- Python 3.10 or newer

## Run

```text
python cyber_trainer.py
```

Choose a topic to read its key points or take a short quiz. Enter `0` at the
main menu to exit; enter `q` at a prompt to return or stop the current quiz.

## Topics

- Spotting phishing
- Safer passwords
- Understanding file hashes
- Reading security logs

The exercises are educational and focus on safer security practices; they do
not interact with other systems.

## Run tests

```text
python -m unittest
```

## Add a lesson

Add a `Lesson` to `LESSONS` in `cyber_trainer.py`. Each lesson has a title, a
short summary, key points, and one or more `Question` objects. A question's
`answer_index` is zero-based: `0` means the first displayed choice.
