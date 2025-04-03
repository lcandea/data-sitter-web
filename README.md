# Data Sitter

<div align="center">
  <h3>Create powerful data contracts that generate Pydantic models</h3>
  <p>Validate data consistently across your stack using Python WASM</p>
</div>

## Overview

Data Sitter is a powerful tool for creating and managing data contracts that automatically generate Pydantic models. It enables seamless validation across your entire stack by running Python validation directly in the browser through WebAssembly.

### Key Features

- 🔒 **Data Validation**: Ensure data quality with powerful validation rules and constraints
- 🌐 **WASM-Powered**: Python validation engine runs directly in your browser for complete privacy
- 📝 **Pydantic Models**: Contracts are translated into Pydantic models for seamless Python integration
- 🤖 **LLM Integration**: Structure LLM responses using generated Pydantic models
- 📊 **Multiple Formats**: Support for CSV, JSON, and YAML data formats
- 👥 **Team Collaboration**: Bridge the gap between technical and business teams

## Getting Started

### Installation

The Data Sitter ecosystem consists of three main packages:

```bash
# Python library
pip install data-sitter

# JavaScript/TypeScript library with WASM bindings
npm install data-sitter

# Web interface (this repository)
git clone https://github.com/lcandea/data-sitter-web
cd data-sitter-web
npm install
npm run dev
```

### Quick Start

1. Create a new contract using the web interface
2. Define fields and validation rules
3. Export the contract to use in your application
4. Generate Pydantic models automatically
5. Validate data consistently across your stack

## Use Cases

### Data Pipeline Validation

Ensure data quality at every stage of your data pipeline with Pydantic-powered validation rules:

```python
from data_sitter import Contract

# Load contract
contract = Contract.from_json("pipeline_contract.json")

# Validate data
validation_result = contract.validate(data)
```

### LLM Response Structuring

Generate Pydantic models from contracts to enforce structured responses from LLMs:

```python
from openai import OpenAI
from data_sitter import Contract

# Load contract and generate model
contract = Contract.from_yaml("sentiment_contract.yaml")

# Use with OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    response_model=contract.pydantic_model,
    messages=[
        {"role": "user", "content": "Analyze the sentiment of this text..."}
    ]
)
```

### Cross-Platform Validation

Use the same contract for validation in both frontend and backend:

```typescript
// Frontend validation using WASM
import * as ds from "data-sitter";

await ds.initializeDataSitter();

const contract = {...}

const response = await ds.validateData(contract, data);
if (!response.success) throw new Error(response.error);
console.log(response.result)

const contract = await Contract.fromFile('user_contract.json');
const isValid = await contract.validate(formData);
```


## Documentation

For detailed documentation, visit:
- [Python Library](https://github.com/lcandea/data-sitter)
- [JavaScript Library](https://github.com/lcandea/data-sitter-js)
- [Web Interface](https://github.com/lcandea/data-sitter-web)

## Contributing

We welcome contributions! Please see our repos above.

## License

This project is licensed under the MIT License.

## Community

- [GitHub Discussions](https://github.com/lcandea/data-sitter/discussions)
- [Report Issues](https://github.com/lcandea/data-sitter/issues)
