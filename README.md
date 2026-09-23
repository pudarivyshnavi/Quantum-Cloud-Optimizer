# ⚛️ Quantum Cloud Optimizer

<div align="center">

### Intelligent Cloud Task Optimization with Quantum-Inspired Scheduling

A modern web-based optimization dashboard for analyzing and visualizing cloud workloads using task characteristics such as CPU requirements, memory, bandwidth, priority, deadlines, VM assignment, and execution time.

</div>

---

## 📌 Overview

**Quantum Cloud Optimizer** is a React and TypeScript based web application designed to provide an interactive interface for studying and optimizing cloud computing workloads.

The project works with a structured task dataset containing **50 cloud tasks** and provides a foundation for exploring intelligent scheduling and resource optimization.

The application focuses on:

- ⚛️ Quantum-inspired optimization concepts
- ☁️ Cloud resource scheduling
- 📊 Workload analysis and visualization
- 🎯 Task priority and deadline analysis
- 💻 CPU and memory resource requirements
- 🌐 Bandwidth requirements
- 🖥️ Virtual-machine allocation
- ⏱️ Task execution-time analysis
- 📈 Interactive dashboard visualization

---

## ✨ Key Features

### 📊 Workload Dashboard

Visualize the characteristics of the cloud workload through an interactive dashboard.

### ⚛️ Quantum-Inspired Optimization

The project is structured around the idea of applying quantum-inspired optimization techniques to cloud scheduling problems.

### 🎯 Priority-Aware Tasks

Each task contains a priority value that can be used when analyzing scheduling decisions.

### ⏰ Deadline Analysis

Task deadlines are included to support deadline-aware optimization and scheduling strategies.

### 💻 Resource-Aware Scheduling

The dataset contains:

- CPU requirements
- Memory requirements
- Bandwidth requirements
- VM assignment
- Execution time

These parameters provide the resource information required for cloud workload analysis.

### 📈 Data Visualization

The project is designed to present workload characteristics using charts and dashboard visualizations.

---

## 🗂️ Dataset

The project includes a sample workload dataset:

```text
data/
└── quantum-tasks.txt
Dataset Fields
Field	Description
task_id	Unique task identifier
length	Task workload length
priority	Task priority
deadline	Task deadline
cpu_req	Required CPU resource
memory_req	Required memory
bandwidth	Required network bandwidth
vm_id	Assigned virtual machine
execution_time	Task execution time
Example
task_id,length,priority,deadline,cpu_req,memory_req,bandwidth,vm_id,execution_time
1,4500,5,15,90,4096,800,1,45
2,100,1,60,5,128,10,3,2
3,3800,5,12,85,3584,750,1,40
🏗️ Architecture
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Development
Node.js
npm
Git
GitHub
Data
Structured TXT/CSV-style workload dataset
50 cloud task records
📁 Project Structure
Quantum-Cloud-Optimizer/
│
├── data/
│   └── quantum-tasks.txt
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
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
└── README.md
🚀 Getting Started
Prerequisites

Make sure you have:

Node.js installed
npm installed
Git installed
1. Clone the repository
git clone https://github.com/pudarivyshnavi/Quantum-Cloud-Optimizer.git
2. Enter the project
cd Quantum-Cloud-Optimizer
3. Install dependencies
npm install
4. Start the development server
npm run dev

The Vite development server will provide a local URL, typically:

http://localhost:8080/
🧪 Build the Project

To create a production build:

npm run build

To preview the production build:

npm run preview
🔍 Code Quality

Run ESLint with:

npm run lint

Run the test suite with:

npm run test
📊 Workload Analysis

The included dataset contains 50 cloud tasks that can be analyzed across multiple dimensions:

Task Priority
      │
      ├── Deadline
      │
      ├── CPU Requirement
      │
      ├── Memory Requirement
      │
      ├── Bandwidth Requirement
      │
      ├── VM Assignment
      │
      └── Execution Time

These dimensions provide the input characteristics for cloud scheduling and optimization experiments.

🎯 Project Goals

The project aims to provide a visual and interactive environment for exploring:

Cloud workload characteristics
Resource allocation
Task scheduling
Priority-aware optimization
Deadline-aware scheduling
Virtual-machine utilization
Quantum-inspired optimization approaches
Workload visualization
🔮 Future Improvements

Possible future extensions include:

Quantum optimization algorithms
QAOA-based scheduling experiments
Automatic VM allocation
Multi-objective optimization
Resource utilization metrics
Makespan comparison
Energy-aware scheduling
Before/after optimization comparisons
Larger benchmark datasets
Real-time optimization visualization
📸 Project Preview

Project screenshots and generated workload-analysis charts will be added to the repository under:

assets/
👩‍💻 Author

Pudari Vyshnavi

GitHub:

https://github.com/pudarivyshnavi

📄 License

This project is available for educational and project-development purposes.

<div align="center">
⚛️ Quantum Cloud Optimizer

Explore • Analyze • Optimize • Visualize

</div> ```