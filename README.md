# Sih-26171
# TATTVA

## Privacy-Preserving On-Device Visual Perception for Lightweight Browser Agents

> Smart India Hackathon 2026 | Problem Statement ID: 26171 | Software

TATTVA is a privacy-first browser vision and automation agent designed for on-device visual perception and secure browser interaction.

Modern browser agents may process screenshots, DOM data, passwords, Personally Identifiable Information (PII), financial information and confidential content through external AI models, creating privacy risks.

TATTVA introduces a local privacy layer for browser agents that detects sensitive information on the user's device, redacts or masks it, generates sanitized context, and enables AI reasoning without unnecessarily exposing raw sensitive browser data.

The system then validates and executes browser actions locally through a browser extension.

## Problem Statement

Problem Statement ID: 26171

Problem: On-device Visual Perception for Lightweight Browser Agents

Existing browser agents face several challenges:

- Sensitive screen and DOM data may be sent to external AI models.
- Raw screenshots can expose passwords, PII, financial and confidential information.
- Complex and dynamic web interfaces are difficult for browser agents to handle.
- Large vision models can require significant CPU, GPU and memory resources.
- Static redaction rules may result in over-redaction or sensitive-data leakage.

Therefore, there is a need for a lightweight browser agent that provides:

- Privacy
- Accuracy
- Low latency
- Efficient resource usage
- Controlled browser interaction

## Our Solution

TATTVA acts as a privacy layer for browser agents.

Instead of directly sending raw browser information to an external AI model, TATTVA processes relevant information locally first.

### Core Pipeline

Browser
↓
DOM / Screen Capture
↓
Local Privacy Engine
↓
Sensitive Information Detection
↓
Redaction / Masking
↓
Sanitized Context
↓
AI / VLM Reasoning
↓
Validation Layer
↓
Permission + Confidence Check
↓
Local Browser Action

## Privacy-First Processing

TATTVA uses a local privacy gate that performs:

1. Detect - identifies sensitive information from browser content.
2. Redact - masks, blurs or removes sensitive information.
3. Sanitize - creates a safer representation of the webpage context.
4. Reason - uses sanitized context for AI/VLM reasoning when required.
5. Validate - evaluates the requested browser action.
6. Execute - executes approved actions locally through the browser.

## Browser Agent

TATTVA is designed to understand and interact with browser interfaces.

The browser agent can support controlled interactions such as:

- Click
- Type
- Scroll
- Navigation
- Web/API interaction

The system uses permission-based and confidence-based controls before executing actions.

When an action is uncertain or unverified, the system can require user confirmation instead of automatically executing it.

## On-Device Visual Perception

TATTVA focuses on lightweight local perception using technologies such as:

- WebGPU
- WebAssembly
- Lightweight AI models
- Quantized models
- OCR
- Browser Extension APIs
- Selective perception

### Selective Perception

Instead of unnecessarily processing the entire screen every time, relevant or changed regions can be analyzed.

This helps reduce:

- Computation
- Memory usage
- Processing time
- Latency

## System Architecture

User
↓
Browser Extension
↓
DOM / Screen Capture
↓
Privacy Engine
↓
Sensitive Information Detection
↓
Redaction Engine
↓
Mask / Blur / Remove
↓
Sanitized Context
↓
AI / VLM Agent
↓
Planning & Reasoning
↓
Validation Layer
↓
Permission + Confidence Check
↓
Local Action
↓
Click / Type / Scroll / Navigate

## Security & Safety

TATTVA includes multiple protection mechanisms.

### Local Privacy Gate

Sensitive information is detected and processed locally before external transmission.

### Permission-Based Control

Agent actions are restricted through explicit browser permissions and action policies.

### Confidence-Based Actions

The agent evaluates confidence before executing actions.

### User Confirmation

Uncertain actions can require user confirmation.

### Fail-Safe Operation

Unsafe or unverified actions are blocked instead of being automatically executed.

### Secure Execution

Sandboxing and controlled permissions are used to reduce the risk of unwanted browser interactions.

## Feasibility

TATTVA is designed using existing browser and AI technologies.

### Model Optimization

Quantization and lightweight models can reduce memory and latency requirements.

### Selective Perception

Only relevant or changed regions can be analyzed to reduce unnecessary computation.

### Browser-Native Architecture

Browser Extension APIs provide access to relevant DOM, screenshots and page state for browser interaction.

### On-Device AI

WebGPU and WebAssembly can be used to support lightweight local model execution.

### Hybrid Intelligence

Local processing can handle perception and sensitive tasks, while external reasoning can be used for more complex tasks when required.

## Technology Stack

### Browser / Frontend

- Browser Extension
- JavaScript
- DOM APIs
- Browser APIs

### On-Device AI

- WebGPU
- WebAssembly
- Lightweight Models
- Quantized Models
- OCR

### Backend

- FastAPI

### Agent Layer

- Browser Agent
- Planning
- Action Execution
- Confidence-Based Validation

### Privacy Layer

- Sensitive Information Detection
- PII Detection
- Redaction
- Masking
- Sanitization

## Potential Applications

TATTVA can be applied in environments where browser-based AI interaction involves sensitive information.

### Enterprise

Employees may handle customer information and confidential business data through browser applications.

### Government & Defence

Sensitive or classified systems may require stronger privacy and controlled AI interaction.

### Healthcare

Patient information displayed through browser applications requires careful handling.

### Privacy-Conscious Consumers

Users may not want browsing information, credentials or sensitive screen content unnecessarily exposed to AI providers.

### Developers & Researchers

TATTVA can provide a safer environment for experimenting with agentic AI on real web interfaces.

## Benefits

### Privacy & Trust

Sensitive screen data can remain on-device during the privacy-processing stage.

### Cost Efficiency

Reducing unnecessary cloud processing can reduce bandwidth and infrastructure requirements.

### Edge Intelligence

Lightweight on-device processing enables AI capabilities on resource-constrained devices.

### Energy Efficiency

Reducing unnecessary data transfer and cloud computation can improve resource efficiency.

### Productivity

Browser agents can automate repetitive browser tasks.

### Safer AI Interaction

Permission, confidence and fail-safe mechanisms provide additional control over agent actions.

## Key Differentiation

TATTVA is not positioned as another general-purpose browser automation agent.

"We are not building another browser agent; we are building a privacy layer for browser agents."

The key difference is the introduction of a local privacy gate before AI reasoning.

Traditional Browser Agent:

Screen / DOM
↓
External AI Model
↓
Browser Action

TATTVA:

Screen / DOM
↓
Local Privacy Gate
↓
Detect Sensitive Information
↓
Redact / Sanitize
↓
AI Reasoning
↓
Validate
↓
Local Browser Action

## Prototype

A prototype of TATTVA has been developed to demonstrate the proposed privacy-first browser-agent workflow.

### Prototype Code / Resources

Google Drive:

https://drive.google.com/file/d/1wNRvnV_jSaHPG0HLqRpYENDfPXvmF379/view?usp=sharing

The prototype resources demonstrate the project's browser-agent and privacy-focused approach.

## Research References

1. Mind2Web: Towards a Generalist Agent for the Web - 2023

2. WebArena: A Realistic Web Environment for Building Autonomous Agents - ICLR 2024

3. VisualWebArena: Evaluating Multimodal Agents on Realistic Visual Web Tasks - ACL 2024

4. Harnessing GUI Grounding for Advanced Visual GUI Agents

5. GUIGuard: Toward a General Framework for Privacy-Preserving GUI Agents - 2026

6. WebPII: Benchmarking Visual PII Detection for Computer-Use Agents - 2026

## Smart India Hackathon 2026

Problem Statement ID: 26171

Problem Statement: On-device Visual Perception for Lightweight Browser Agents

Category: Software

Team Name: TATTVA

Theme: On-device Visual Perception

Domain: AI / ML

## Project Resources

### Prototype Code / Drive

https://drive.google.com/file/d/1wNRvnV_jSaHPG0HLqRpYENDfPXvmF379/view?usp=sharing

### SIH Presentation

TATTVA SIH 2026 presentation is included in the project submission.

## Vision

TATTVA aims to make browser-based AI interaction more privacy-conscious by keeping sensitive perception and privacy protection as close to the user's device as possible.

The project combines:

On-Device AI + Privacy Protection + Visual Perception + Browser Automation + Controlled Agentic Execution

to create a safer approach to intelligent browser interaction.

---

# TATTVA

See Locally. Protect Privately. Act Intelligently.
