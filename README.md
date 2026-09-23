Quantum Cloud Optimizer

A React + TypeScript + Vite dashboard for exploring cloud workloads, analyzing resource requirements, and visualizing quantum-inspired optimization concepts.

📌 Overview

Quantum Cloud Optimizer is a web-based cloud workload analysis and optimization project.

The application provides an interactive dashboard for analyzing a workload dataset containing task priorities, deadlines, CPU requirements, memory requirements, bandwidth requirements, VM assignments, and execution times.

The project demonstrates how cloud workload characteristics can be explored through data visualization and how quantum-inspired optimization concepts can be applied to cloud resource allocation and scheduling.

✨ Features
📊 Interactive workload dashboard
⚛️ Quantum-inspired cloud optimization concept
📈 Workload statistics and visualizations
🎯 Task priority analysis
💻 Virtual machine distribution analysis
⏱️ Execution-time analysis
🧠 CPU, memory, and bandwidth demand analysis
📂 Dataset stored locally in CSV-style TXT format
🖥️ Responsive React interface
🎨 Modern dashboard UI
🧪 Unit testing with Vitest
🔍 ESLint code-quality checks
⚡ Fast Vite development environment
🏗️ Architecture
                    ┌─────────────────────────────┐
                    │       Quantum Cloud         │
                    │         Optimizer           │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │        React Frontend       │
                    │     TypeScript + Vite       │
                    └──────────────┬──────────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
          ┌────────────┐   ┌────────────┐   ┌────────────┐
          │ Workload   │   │ Analytics  │   │ Quantum    │
          │ Dataset    │   │ & Charts   │   │ Optimizer  │
          └────────────┘   └────────────┘   └────────────┘
                 │                 │                 │
                 └─────────────────┼─────────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │       Cloud Workload        │
                    │          Analysis            │
                    └─────────────────────────────┘
                    📊 Dataset

The project uses a sample cloud workload dataset located at:

data/quantum-tasks.txt

The dataset contains 50 cloud tasks.

Dataset Schema
Field	Description
task_id	Unique task identifier
length	Task workload length
priority	Task priority level
deadline	Task deadline
cpu_req	Required CPU resources
memory_req	Required memory
bandwidth	Required network bandwidth
vm_id	Assigned virtual machine
execution_time	Task execution time
Example
task_id,length,priority,deadline,cpu_req,memory_req,bandwidth,vm_id,execution_time
1,4500,5,15,90,4096,800,1,45
2,100,1,60,5,128,10,3,2
3,3800,5,12,85,3584,750,1,40
4,150,1,55,8,256,15,4,3
📊 Workload Visualizations

The following charts are generated from the actual 50-task dataset included in this repository.

🎯 Task Priority Distribution

This chart shows how the 50 tasks are distributed across the available priority levels.

<img src="assets/priority-distribution.png" alt="Task Priority Distribution" width="85%">
🖥️ Virtual Machine Distribution

This chart shows how tasks are distributed across the virtual machines represented in the dataset.

<img src="assets/vm-distribution.png" alt="Virtual Machine Distribution" width="85%">
⏱️ Execution Time Across the Workload

This visualization shows the execution-time values across the 50 task records.

<img src="assets/execution-time.png" alt="Execution Time Across Tasks" width="95%">
💻 Resource Demand

CPU, memory, and bandwidth have different units and scales, so this visualization uses normalized values to show their relative demand patterns across the workload.

<img src="assets/resource-demand.png" alt="Normalized Resource Demand" width="95%">
🧠 Optimization Concept

Cloud scheduling is a resource allocation problem where multiple tasks compete for computational resources.

The workload can be represented using characteristics such as:
Task
 │
 ├── Length
 ├── Priority
 ├── Deadline
 ├── CPU Requirement
 ├── Memory Requirement
 ├── Bandwidth Requirement
 ├── VM Assignment
 └── Execution Time
 The optimization process can consider these characteristics when exploring scheduling decisions.

The quantum-inspired direction of the project provides a framework for experimenting with optimization strategies for complex scheduling problems.

Note: The repository does not claim benchmark performance improvements that have not been measured. The included charts describe the supplied workload rather than claiming an optimization advantage.

🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Development Tools
Node.js
npm
Git
GitHub
Testing
Vitest
Playwright configuration
ESLint
Data
Structured TXT / CSV-style workload dataset
50 cloud task records
📁 Project Structure
Quantum-Cloud-Optimizer/
│
├── assets/
│   ├── architecture.svg
│   ├── banner.svg
│   ├── banner-animated.gif
│   ├── priority-distribution.png
│   ├── vm-distribution.png
│   ├── execution-time.png
│   └── resource-demand.png
│
├── data/
│   └── quantum-tasks.txt
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── Navbar.tsx
│   │   └── NavLink.tsx
│   │
│   ├── context/
│   │   └── SimulationContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── fileParser.ts
│   │   ├── simulation.ts
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── ConfigPage.tsx
│   │   ├── Home.tsx
│   │   ├── Index.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── SimulationPage.tsx
│   │   └── UploadPage.tsx
│   │
│   ├── test/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
🚀 Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
Git

You can verify them with:
node --version
npm --version
git --version1. 
Clone the Repository
git clone https://github.com/pudarivyshnavi/Quantum-Cloud-Optimizer.git
2. Enter the Project
cd Quantum-Cloud-Optimizer
3. Install Dependencies
npm install
4. Start the Development Server
npm run dev

Vite will display the local development URL in the terminal.

For the current project configuration, the development server runs on:

[http://localhost:8080/](http://localhost:8080/)
🏭 Production Build

Create a production build with:

npm run build
Preview the production build with:

npm run preview
🧪 Testing

Run the test suite:

npm run test

Run ESLint:

npm run lint

Scheduling Factors
                Cloud Workload
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   Priority         Deadline        Resources
       │               │                │
       │               │       ┌────────┼────────┐
       │               │       │        │        │
       │               │      CPU     Memory  Bandwidth
       │               │
       └───────────────┼────────────────┘
                       │
                  VM Assignment
                       │
                       ▼
                Scheduling Analysis
                       │
                       ▼
                Optimization Study
📋 Workload Characteristics

The sample dataset contains workloads with different:

Task sizes
Priority levels
Deadlines
CPU requirements
Memory requirements
Bandwidth requirements
VM assignments
Execution times

This makes the dataset useful for demonstrating cloud scheduling and resource-allocation analysis.

🎯 Project Goals

The main goals of the project are:

Analyze cloud workload characteristics.
Visualize workload and resource requirements.
Understand VM workload distribution.
Explore cloud scheduling challenges.
Demonstrate quantum-inspired optimization concepts.
Provide a foundation for future optimization algorithms.
🔮 Future Improvements

Potential future extensions include:

Quantum-inspired scheduling algorithms
QAOA-based optimization experiments
Advanced VM allocation
Dynamic workload scheduling
Deadline-aware optimization
Multi-objective optimization
Real-time cloud monitoring
Cloud resource utilization tracking
Optimization benchmark comparison
Integration with quantum computing simulators
Interactive optimization controls
Larger real-world workload datasets
🖼️ Project Visuals
Architecture

Dashboard Visualizations

The project includes generated visualizations based on the actual 50-task workload dataset.

These visualizations are intended to explain the characteristics of the dataset and should not be interpreted as measured optimization benchmarks.

📌 Important Note

This project is primarily a cloud workload analysis and quantum-inspired optimization exploration project.

The charts included in the repository represent the supplied workload dataset. They do not claim that a quantum optimization algorithm has achieved a specific performance improvement unless such a benchmark is explicitly implemented and measured.

👩‍💻 Author

Pudari Vyshnavi

GitHub:

https://github.com/pudarivyshnavi

📄 License

This project is provided for educational and project-development purposes.

<div align="center">
⚛️ Quantum Cloud Optimizer
Explore • Analyze • Optimize • Visualize

Built with React + TypeScript + Vite

</div>
