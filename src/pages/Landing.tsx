import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Database, Cpu, Code, Bot } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import DataSitterIcon from "../components/ui/DataSitterIcon";

const features = [
  {
    icon: <Shield className="h-12 w-12 text-primary" />,
    title: "Data Validation",
    description:
      "Ensure data quality with powerful validation rules and constraints.",
  },
  {
    icon: <Cpu className="h-12 w-12 text-primary" />,
    title: "WASM-Powered",
    description:
      "Python validation engine runs directly in your browser for complete privacy.",
  },
  {
    icon: <Code className="h-12 w-12 text-primary" />,
    title: "Pydantic Models",
    description:
      "Contracts are translated into Pydantic models for seamless Python integration.",
  },
  {
    icon: <Bot className="h-12 w-12 text-primary" />,
    title: "LLM Integration",
    description: "Structure LLM responses using generated Pydantic models.",
  },
  {
    icon: <Database className="h-12 w-12 text-primary" />,
    title: "Multiple Formats",
    description: "Support for CSV, JSON, and YAML data formats.",
  },
  {
    icon: <Users className="h-12 w-12 text-primary" />,
    title: "Team Collaboration",
    description: "Bridge the gap between technical and business teams.",
  },
];

const useCases = [
  {
    title: "Data Pipeline Validation",
    description:
      "Ensure data quality at every stage of your data pipeline with Pydantic-powered validation rules.",
    tags: ["ETL", "Data Quality", "Pipelines"],
  },
  {
    title: "LLM Response Structuring",
    description:
      "Generate Pydantic models from contracts to enforce structured responses from LLMs like OpenAI.",
    tags: ["LLM", "AI", "OpenAI"],
  },
  {
    title: "Cross-Platform Validation",
    description:
      "Use the same contract in both frontend (WASM) and backend (Python) for consistent validation.",
    tags: ["Frontend", "Backend", "Consistency"],
  },
];

const repositories = [
  {
    name: "Data Sitter Python",
    description:
      "Core Python library for data validation and contract management",
    url: "https://github.com/lcandea/data-sitter",
    install: "pip install data-sitter",
  },
  {
    name: "Data Sitter JS",
    description: "JavaScript/TypeScript library with WASM bindings",
    url: "https://github.com/lcandea/data-sitter-js",
    install: "npm install data-sitter",
  },
  {
    name: "Data Sitter Web",
    description: "Web interface for creating and managing data contracts",
    url: "https://github.com/lcandea/data-sitter-web",
  },
];

const sampleContract = {
  name: "UserValidation",
  fields: [
    {
      field_name: "ID",
      field_type: "IntegerField",
      field_rules: ["Is not null", "Is positive"],
    },
    {
      field_name: "Name",
      field_type: "StringField",
      field_rules: [
        "Is not null",
        "Has length between $values.min_length and $values.max_length",
      ],
    },
    {
      field_name: "Title",
      field_type: "StringField",
      field_rules: ["Is one of ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']"],
    },
  ],
  values: {
    min_length: 2,
    max_length: 50,
  },
};

export function Landing() {
  return (
    <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-20 md:py-28">
      <DataSitterIcon className="h-64 w-64 text-primary mb-10" />
      <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-blue-500 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
        Data Contracts Made Simple
      </h1>
      <p className="mt-6 text-xl text-center text-muted-foreground max-w-3xl">
        Create powerful data contracts that automatically generate Pydantic
        models for seamless validation across your stack. Powered by Python WASM
        for privacy-first validation directly in your browser.
      </p>

      {/* How It Works Section */}
      <div className="mt-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Define Contract</h3>
            <p className="text-muted-foreground">
              Create a human-readable data contract using our intuitive editor.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate Model</h3>
            <p className="text-muted-foreground">
              Contract is automatically converted to a Pydantic model.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Validate Anywhere</h3>
            <p className="text-muted-foreground">
              Use in browser with WASM or in your Python backend.
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <Button size="lg" asChild>
          <Link to="/contract">Get Started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a
            href="https://github.com/lcandea/data-sitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="mr-2 h-5 w-5" />
            View on GitHub
          </a>
        </Button>
      </div>

      {/* Features Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Carousel Section */}
      <div className="mt-24 w-full">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <div className="p-1">
                <Card className="rounded-lg overflow-hidden border">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Contract Editor
                    </span>
                  </div>
                  <div className="bg-muted flex items-center justify-center">
                    <img src="/rule-example.webp" />
                  </div>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1">
                <Card className="rounded-lg overflow-hidden border">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      contract.json
                    </span>
                  </div>
                  <div className="p-4 bg-muted">
                    <pre className="text-sm overflow-x-auto">
                      <code>{JSON.stringify(sampleContract, null, 2)}</code>
                    </pre>
                  </div>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1">
                <Card className="rounded-lg overflow-hidden border">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Contract Validator
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="/validator-example.webp" />
                  </div>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Use Cases Section */}
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground mb-4">
                {useCase.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {useCase.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Source Section */}
      <div className="mt-24 w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Open Source</h2>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Data Sitter is fully open source and available under the MIT license.
          Join our community and help us make data validation better for
          everyone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {repositories.map((repo) => (
            <Card key={repo.name} className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <GitHubLogoIcon className="h-5 w-5" />
                {repo.name}
              </h3>
              <p className="text-muted-foreground mb-4">{repo.description}</p>
              {repo.install && (
                <pre className="p-2 bg-muted rounded-md mb-4 text-sm overflow-x-auto">
                  <code>{repo.install}</code>
                </pre>
              )}
              <Button variant="outline" asChild className="w-full">
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  View Repository
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Create your first data contract and generate Pydantic models in
          minutes.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/contract">Create Contract</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/lcandea/data-sitter/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
