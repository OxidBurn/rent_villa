# FastAPI AI/LLM Pipeline Setup Specification

> **Purpose**: Reproducible specification for setting up a complete CI/CD pipeline for FastAPI + PydanticAI + Agentic LLM projects.
>
> **Target Audience**: Claude Code, development teams building AI/LLM applications
>
> **Last Updated**: 2025-10-31
>
> **Version**: 1.0.0

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Tech Stack Decisions](#tech-stack-decisions)
4. [Setup Phases](#setup-phases)
5. [Configuration Files](#configuration-files)
6. [Environment Variables](#environment-variables)
7. [Documentation Structure](#documentation-structure)
8. [AI/LLM Specific Considerations](#aillm-specific-considerations)
9. [Validation & Testing](#validation--testing)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## Overview

This specification defines a production-ready development pipeline for AI/LLM applications built with FastAPI, including:

- **Continuous Integration** (GitHub Actions)
- **Continuous Deployment** (Railway/Fly.io/AWS)
- **Automated Testing** (Pytest + AI-specific testing)
- **Database Management** (SQLAlchemy + Alembic + PostgreSQL)
- **Code Quality** (Ruff + Black + mypy)
- **Error Tracking** (Sentry)
- **LLM Monitoring** (LangSmith/Langfuse)
- **Agent Framework** (PydanticAI)
- **Comprehensive Documentation**

### Philosophy

- **AI-First Architecture**: Design for LLM integration from day one
- **Observability**: Track LLM calls, costs, and performance
- **Type Safety**: Use Pydantic for all data validation
- **Async Everything**: Leverage async/await for concurrent LLM calls
- **Cost Awareness**: Monitor and optimize LLM API costs
- **Reproducibility**: Version control prompts and model configurations

### Success Criteria

- ✅ CI pipeline completes in <5 minutes
- ✅ Automatic deployment to staging within 10 minutes
- ✅ LLM observability with token tracking
- ✅ Type-safe agent definitions
- ✅ Comprehensive test coverage (>80%)
- ✅ Cost monitoring per endpoint
- ✅ Sub-second API response times (excluding LLM latency)

## Prerequisites

### Required Accounts

1. **GitHub Account**
   - Repository with admin access
   - Actions enabled

2. **Deployment Platform** (choose one)
   - **Railway** (recommended for simplicity)
   - **Fly.io** (recommended for scale)
   - **AWS ECS** (for enterprise)
   - **Vercel** (serverless functions)

3. **LLM Provider** (one or more)
   - **OpenAI** (GPT-4, GPT-3.5)
   - **Anthropic** (Claude)
   - **Google** (Gemini)
   - **Azure OpenAI**

4. **LLM Observability** (choose one)
   - **LangSmith** (recommended for LangChain)
   - **Langfuse** (open source alternative)
   - **Weights & Biases** (for ML teams)

5. **Error Tracking**
   - **Sentry** (recommended)

6. **Database Provider**
   - **Railway Postgres** (if using Railway)
   - **Supabase** (managed Postgres)
   - **Neon** (serverless Postgres)

### Required Tools (Local Development)

```bash
# Python 3.11+ (3.12 recommended)
python --version  # Should be v3.11.x or v3.12.x

# pip (comes with Python)
pip --version

# Poetry (dependency management)
curl -sSL https://install.python-poetry.org | python3 -

# Git
git --version

# GitHub CLI (recommended)
gh --version

# Docker (for local testing)
docker --version

# psql (PostgreSQL client)
psql --version
```

### Repository Setup

```bash
# Create new project with Poetry
poetry new project-name
cd project-name

# Or for existing directory
cd project-name
poetry init

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
gh repo create project-name --public --source=. --push
```

## Tech Stack Decisions

### Core Framework

- **FastAPI 0.110+** - Modern async Python web framework
- **Python 3.12** - Latest stable Python with performance improvements
- **Pydantic 2.x** - Data validation and settings management
- **Uvicorn** - ASGI server with auto-reload

### AI/LLM Stack

| Tool              | Purpose            | Why?                                       |
| ----------------- | ------------------ | ------------------------------------------ |
| **PydanticAI**    | Agent framework    | Type-safe, Pydantic-native, multi-provider |
| **LangChain**     | LLM orchestration  | Rich ecosystem, proven patterns            |
| **OpenAI SDK**    | Direct API access  | Fine-grained control, streaming            |
| **Anthropic SDK** | Claude integration | Best-in-class reasoning                    |

### Database & ORM

| Tool               | Purpose             | Why?                                        |
| ------------------ | ------------------- | ------------------------------------------- |
| **PostgreSQL**     | Relational database | Vector support (pgvector), mature ecosystem |
| **SQLAlchemy 2.0** | ORM                 | Async support, type hints, powerful         |
| **Alembic**        | Migrations          | Industry standard, SQLAlchemy integration   |
| **pgvector**       | Vector storage      | Native Postgres extension for embeddings    |

### Testing

| Tool               | Purpose            | Why?                                     |
| ------------------ | ------------------ | ---------------------------------------- |
| **pytest**         | Test framework     | De facto standard, rich plugin ecosystem |
| **pytest-asyncio** | Async testing      | Required for FastAPI async code          |
| **pytest-cov**     | Coverage reporting | Integrated coverage measurement          |
| **httpx**          | HTTP client        | Async support, perfect for API testing   |
| **pytest-mock**    | Mocking            | Mock LLM responses for testing           |
| **vcrpy**          | Record/replay      | Record real LLM interactions             |

### Code Quality

| Tool           | Purpose              | Why?                                  |
| -------------- | -------------------- | ------------------------------------- |
| **Ruff**       | Linting & formatting | Blazing fast, replaces Flake8 + isort |
| **Black**      | Code formatting      | Opinionated, industry standard        |
| **mypy**       | Type checking        | Catch type errors at development time |
| **pre-commit** | Git hooks            | Enforce quality before commit         |

### CI/CD

| Tool               | Purpose          | Why?                              |
| ------------------ | ---------------- | --------------------------------- |
| **GitHub Actions** | CI pipeline      | Free for public repos, powerful   |
| **Railway**        | Deployment       | Zero-config, great DX, affordable |
| **Docker**         | Containerization | Reproducible deployments          |

### Monitoring & Observability

| Tool           | Purpose        | Why?                              |
| -------------- | -------------- | --------------------------------- |
| **Sentry**     | Error tracking | Excellent Python support          |
| **LangSmith**  | LLM monitoring | Track prompts, costs, latency     |
| **Prometheus** | Metrics        | Industry standard, rich ecosystem |
| **Grafana**    | Dashboards     | Visualization for metrics         |

### Dependency Management

| Tool       | Purpose                   | Why?                            |
| ---------- | ------------------------- | ------------------------------- |
| **Poetry** | Dependency management     | Lock files, better than pip     |
| **pyenv**  | Python version management | Manage multiple Python versions |

## Setup Phases

Follow these phases in order. Each phase builds on the previous one.

### Phase 1: Core API Setup (Week 1)

**Goal**: Get basic FastAPI application running with CI/CD

#### Tasks

1. **Project Structure & Poetry Setup**
2. **FastAPI Basic Application**
3. **GitHub Actions CI Workflow**
4. **Docker Configuration**
5. **Deployment Setup (Railway/Fly.io)**

**Deliverables**:

- FastAPI app with health endpoint
- CI runs on every push/PR
- Automatic deployment to staging
- Docker image building

### Phase 2: Database & Migrations (Week 2)

**Goal**: Database setup with migrations

#### Tasks

6. **PostgreSQL + SQLAlchemy Setup**
7. **Alembic Migrations**
8. **Database Models**
9. **Repository Pattern Implementation**

**Deliverables**:

- Database connection and models
- Migration system working
- CRUD operations tested
- Async database queries

### Phase 3: AI/LLM Integration (Week 3)

**Goal**: PydanticAI agents and LLM integration

#### Tasks

10. **PydanticAI Agent Setup**
11. **LLM Provider Configuration**
12. **Prompt Management System**
13. **Streaming Response Implementation**
14. **Token Counting & Cost Tracking**

**Deliverables**:

- Type-safe agents working
- Multi-provider support
- Streaming endpoints
- Cost tracking per request

### Phase 4: Testing & Quality (Week 4)

**Goal**: Comprehensive testing and code quality

#### Tasks

15. **Pytest Infrastructure**
16. **AI Testing Strategy (mocking, VCR)**
17. **Code Quality Tooling (Ruff, mypy)**
18. **Pre-commit Hooks**

**Deliverables**:

- Full test suite (>80% coverage)
- AI responses mocked for testing
- Type checking passing
- Auto-formatting on commit

### Phase 5: Observability & Production (Week 5)

**Goal**: Production-ready monitoring and deployment

#### Tasks

19. **Sentry Error Tracking**
20. **LangSmith/Langfuse Integration**
21. **Prometheus Metrics**
22. **Rate Limiting & Caching**
23. **Production Deployment**
24. **Documentation & Runbooks**

**Deliverables**:

- Error tracking configured
- LLM call monitoring
- API metrics dashboards
- Rate limiting per user
- Production deployment validated
- Complete documentation

## Configuration Files

### 1. Project Structure

```
project-name/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings with Pydantic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py  # Dependency injection
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py
│   │   │   ├── agents.py
│   │   │   └── chat.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base.py          # Base agent class
│   │   ├── researcher.py    # Example agent
│   │   └── assistant.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py       # Database session
│   │   ├── models.py        # SQLAlchemy models
│   │   └── repositories/
│   │       ├── __init__.py
│   │       └── base.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   └── chat.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── llm.py          # LLM service layer
│   │   └── cache.py
│   ├── prompts/            # Prompt templates
│   │   ├── __init__.py
│   │   └── templates.py
│   └── utils/
│       ├── __init__.py
│       ├── logging.py
│       └── metrics.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   │   └── test_agents.py
│   ├── integration/
│   │   └── test_api.py
│   └── fixtures/
│       └── vcr_cassettes/
├── alembic/
│   ├── versions/
│   └── env.py
├── .env.example
├── .gitignore
├── .pre-commit-config.yaml
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── poetry.lock
├── alembic.ini
├── ruff.toml
├── mypy.ini
└── README.md
```

### 2. Poetry Configuration

**File**: `pyproject.toml`

```toml
[tool.poetry]
name = "project-name"
version = "0.1.0"
description = "FastAPI AI/LLM application"
authors = ["Your Name <your.email@example.com>"]
readme = "README.md"
packages = [{include = "src"}]

[tool.poetry.dependencies]
python = "^3.12"
fastapi = "^0.110.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
pydantic = "^2.6.0"
pydantic-settings = "^2.1.0"
sqlalchemy = "^2.0.27"
alembic = "^1.13.1"
asyncpg = "^0.29.0"  # Async PostgreSQL driver
psycopg2-binary = "^2.9.9"  # Sync driver for Alembic
pydantic-ai = "^0.0.1"  # Adjust version as available
openai = "^1.12.0"
anthropic = "^0.18.0"
langchain = "^0.1.7"
langchain-openai = "^0.0.5"
langsmith = "^0.0.87"
redis = "^5.0.1"  # For caching
sentry-sdk = {extras = ["fastapi"], version = "^1.40.0"}
prometheus-client = "^0.19.0"
python-multipart = "^0.0.9"  # For file uploads
httpx = "^0.26.0"  # Async HTTP client

[tool.poetry.group.dev.dependencies]
pytest = "^8.0.0"
pytest-asyncio = "^0.23.4"
pytest-cov = "^4.1.0"
pytest-mock = "^3.12.0"
vcrpy = "^6.0.1"
httpx = "^0.26.0"
ruff = "^0.2.0"
black = "^24.1.1"
mypy = "^1.8.0"
pre-commit = "^3.6.0"
ipython = "^8.21.0"
types-redis = "^4.6.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
]
ignore = [
    "E501",  # line too long (handled by black)
    "B008",  # do not perform function calls in argument defaults
]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]  # Ignore unused imports in __init__.py

[tool.black]
line-length = 100
target-version = ['py312']
include = '\.pyi?$'

[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
plugins = ["pydantic.mypy"]

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--strict-markers",
    "--cov=src",
    "--cov-report=term-missing",
    "--cov-report=html",
]

[tool.coverage.run]
source = ["src"]
omit = [
    "*/tests/*",
    "*/__init__.py",
    "*/migrations/*",
]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
    "if __name__ == .__main__.:",
    "if TYPE_CHECKING:",
]
```

### 3. GitHub Actions CI Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: '3.12'

jobs:
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache Poetry dependencies
        uses: actions/cache@v4
        with:
          path: ~/.cache/pypoetry
          key: poetry-${{ runner.os }}-${{ hashFiles('**/poetry.lock') }}

      - name: Install Poetry
        run: |
          curl -sSL https://install.python-poetry.org | python3 -
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Install dependencies
        run: poetry install --no-interaction

      - name: Run Ruff (lint)
        run: poetry run ruff check .

      - name: Run Black (format check)
        run: poetry run black --check .

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache Poetry dependencies
        uses: actions/cache@v4
        with:
          path: ~/.cache/pypoetry
          key: poetry-${{ runner.os }}-${{ hashFiles('**/poetry.lock') }}

      - name: Install Poetry
        run: |
          curl -sSL https://install.python-poetry.org | python3 -
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Install dependencies
        run: poetry install --no-interaction

      - name: Run mypy
        run: poetry run mypy src

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache Poetry dependencies
        uses: actions/cache@v4
        with:
          path: ~/.cache/pypoetry
          key: poetry-${{ runner.os }}-${{ hashFiles('**/poetry.lock') }}

      - name: Install Poetry
        run: |
          curl -sSL https://install.python-poetry.org | python3 -
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Install dependencies
        run: poetry install --no-interaction

      - name: Run tests with coverage
        env:
          DATABASE_URL: 'postgresql+asyncpg://test:test@localhost:5432/test_db'
          REDIS_URL: 'redis://localhost:6379'
          OPENAI_API_KEY: 'sk-test-key' # Mock key for testing
        run: poetry run pytest --cov --cov-report=xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml
          fail_ci_if_error: false

  docker:
    name: Docker Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: ${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 4. Dockerfile

**File**: `Dockerfile`

```dockerfile
# Multi-stage build for smaller final image
FROM python:3.12-slim as builder

# Install Poetry
RUN pip install poetry==1.8.0

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies (no dev dependencies)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-dev

# Final stage
FROM python:3.12-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 appuser

# Set working directory
WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5. Docker Compose (Local Development)

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '8000:8000'
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/app_db
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - ENVIRONMENT=development
    volumes:
      - ./src:/app/src
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: pgvector/pgvector:pg16
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=app_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

### 6. FastAPI Application

**File**: `src/main.py`

```python
from contextlib import asynccontextmanager
from typing import AsyncIterator

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

from src.api.routes import health, agents, chat
from src.config import get_settings
from src.db.session import engine
from src.utils.logging import setup_logging

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    setup_logging()

    # Initialize Sentry
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=1.0,
        )

    yield

    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI AI/LLM Application",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

# Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "message": "FastAPI AI/LLM API",
        "version": settings.VERSION,
        "docs": "/docs",
    }
```

### 7. Settings Configuration

**File**: `src/config.py`

```python
from functools import lru_cache
from typing import Literal

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # Application
    PROJECT_NAME: str = "FastAPI AI App"
    VERSION: str = "0.1.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = False
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Database
    DATABASE_URL: PostgresDsn
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis
    REDIS_URL: RedisDsn
    CACHE_TTL: int = 3600  # 1 hour

    # LLM Providers
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    ANTHROPIC_API_KEY: str | None = None
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20250131"

    # LLM Settings
    DEFAULT_TEMPERATURE: float = 0.7
    DEFAULT_MAX_TOKENS: int = 2000
    LLM_TIMEOUT: int = 60  # seconds

    # Observability
    SENTRY_DSN: str | None = None
    LANGSMITH_API_KEY: str | None = None
    LANGSMITH_PROJECT: str | None = None

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Costs (USD per 1M tokens)
    GPT4_INPUT_COST: float = 10.0
    GPT4_OUTPUT_COST: float = 30.0
    CLAUDE_INPUT_COST: float = 3.0
    CLAUDE_OUTPUT_COST: float = 15.0


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

### 8. Health Check Endpoint

**File**: `src/api/routes/health.py`

```python
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.schemas.health import HealthCheck
from src.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/", response_model=HealthCheck)
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthCheck:
    """
    Health check endpoint.

    Verifies:
    - API is running
    - Database connection
    - Redis connection
    """
    start_time = datetime.now()

    # Check database
    try:
        await db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    response_time = (datetime.now() - start_time).total_seconds()

    is_healthy = db_status == "healthy"

    if not is_healthy:
        raise HTTPException(status_code=503, detail="Service unhealthy")

    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(),
        database=db_status,
        response_time_ms=int(response_time * 1000),
        environment=settings.ENVIRONMENT,
        version=settings.VERSION,
    )
```

### 9. Database Session

**File**: `src/db/session.py`

```python
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from src.config import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.DEBUG,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncIterator[AsyncSession]:
    """Dependency for getting database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 10. PydanticAI Agent Example

**File**: `src/agents/researcher.py`

```python
from typing import Any

from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

from src.config import get_settings

settings = get_settings()


class ResearchQuery(BaseModel):
    """Research query input."""
    query: str = Field(..., description="The research question")
    max_results: int = Field(5, description="Maximum number of results")


class ResearchResult(BaseModel):
    """Research result output."""
    answer: str = Field(..., description="The research answer")
    sources: list[str] = Field(default_factory=list, description="Source URLs")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")


# Initialize the model
model = OpenAIModel(settings.OPENAI_MODEL, api_key=settings.OPENAI_API_KEY)

# Create agent
research_agent = Agent(
    model=model,
    result_type=ResearchResult,
    system_prompt=(
        "You are a research assistant that provides accurate, well-sourced answers. "
        "Always cite your sources and indicate your confidence level."
    ),
)


@research_agent.tool
async def search_web(query: str) -> list[str]:
    """Search the web for information."""
    # Implement web search (e.g., using Brave API, SerpAPI, etc.)
    return [
        f"https://example.com/result1?q={query}",
        f"https://example.com/result2?q={query}",
    ]


async def research(query: ResearchQuery) -> ResearchResult:
    """
    Perform research on a query.

    Args:
        query: The research query

    Returns:
        Research results with sources
    """
    result = await research_agent.run(query.query)
    return result.data
```

### 11. Pre-commit Configuration

**File**: `.pre-commit-config.yaml`

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-json
      - id: check-toml
      - id: check-merge-conflict
      - id: detect-private-key

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.2.0
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [pydantic, sqlalchemy]
        args: [--ignore-missing-imports]
```

### 12. Environment Variables Example

**File**: `.env.example`

```bash
# Application
PROJECT_NAME="FastAPI AI App"
VERSION="0.1.0"
ENVIRONMENT="development"
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000"]

# Database
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app_db"
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL="redis://localhost:6379"
CACHE_TTL=3600

# LLM Providers
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo-preview"
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20250131"

# LLM Settings
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=2000
LLM_TIMEOUT=60

# Observability
SENTRY_DSN="https://...@sentry.io/..."
LANGSMITH_API_KEY="ls__..."
LANGSMITH_PROJECT="my-project"

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

## Environment Variables

### Local Development

Create `.env` file (DO NOT commit):

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### Railway Deployment

Configure in Railway Dashboard:

| Variable            | Description                            | Required |
| ------------------- | -------------------------------------- | -------- |
| `DATABASE_URL`      | Postgres connection (Railway provides) | Yes      |
| `REDIS_URL`         | Redis connection (Railway provides)    | Yes      |
| `OPENAI_API_KEY`    | OpenAI API key                         | Yes      |
| `ANTHROPIC_API_KEY` | Anthropic API key                      | No       |
| `SENTRY_DSN`        | Sentry error tracking                  | No       |
| `LANGSMITH_API_KEY` | LangSmith observability                | No       |

## AI/LLM Specific Considerations

### 1. Prompt Management

**Best Practices**:

- Version control all prompts
- Use templating (Jinja2)
- A/B test prompts
- Track prompt performance

**File**: `src/prompts/templates.py`

```python
from jinja2 import Template

RESEARCH_PROMPT = Template("""
You are a research assistant. The user asked: "{{ query }}"

Please provide:
1. A comprehensive answer
2. At least {{ min_sources }} credible sources
3. Your confidence level (0-1)

Focus on accuracy and cite all sources.
""")

CHAT_PROMPT = Template("""
You are a helpful assistant. Previous context:
{% for message in history[-5:] %}
{{ message.role }}: {{ message.content }}
{% endfor %}

User: {{ user_message }}
Assistant:
""")
```

### 2. Token Counting & Cost Tracking

**File**: `src/utils/tokens.py`

```python
import tiktoken
from typing import Literal

from src.config import get_settings

settings = get_settings()


def count_tokens(text: str, model: str = "gpt-4") -> int:
    """Count tokens in text for a given model."""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))


def calculate_cost(
    input_tokens: int,
    output_tokens: int,
    model: Literal["gpt-4", "gpt-3.5", "claude-3-5-sonnet"],
) -> float:
    """Calculate cost in USD for API call."""
    if model == "gpt-4":
        input_cost = (input_tokens / 1_000_000) * settings.GPT4_INPUT_COST
        output_cost = (output_tokens / 1_000_000) * settings.GPT4_OUTPUT_COST
    elif model == "claude-3-5-sonnet":
        input_cost = (input_tokens / 1_000_000) * settings.CLAUDE_INPUT_COST
        output_cost = (output_tokens / 1_000_000) * settings.CLAUDE_OUTPUT_COST
    else:
        input_cost = output_cost = 0.0

    return input_cost + output_cost
```

### 3. LLM Response Caching

**File**: `src/services/cache.py`

```python
import hashlib
import json
from typing import Any

from redis.asyncio import Redis

from src.config import get_settings

settings = get_settings()

redis = Redis.from_url(str(settings.REDIS_URL), decode_responses=True)


def generate_cache_key(prompt: str, model: str, temperature: float) -> str:
    """Generate deterministic cache key."""
    data = json.dumps({"prompt": prompt, "model": model, "temperature": temperature})
    return f"llm:{hashlib.sha256(data.encode()).hexdigest()}"


async def get_cached_response(key: str) -> Any | None:
    """Get cached LLM response."""
    cached = await redis.get(key)
    return json.loads(cached) if cached else None


async def cache_response(key: str, response: Any, ttl: int = 3600) -> None:
    """Cache LLM response."""
    await redis.setex(key, ttl, json.dumps(response))
```

### 4. Streaming Responses

**File**: `src/api/routes/chat.py`

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.agents.assistant import chat_agent

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    stream: bool = False


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat response."""

    async def generate():
        async for chunk in chat_agent.run_stream(request.message):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
```

### 5. LLM Observability (LangSmith)

**File**: `src/utils/observability.py`

```python
from langsmith import Client
from langsmith.run_helpers import traceable

from src.config import get_settings

settings = get_settings()

langsmith_client = None
if settings.LANGSMITH_API_KEY:
    langsmith_client = Client(api_key=settings.LANGSMITH_API_KEY)


@traceable(run_type="llm", name="openai_call")
async def traced_llm_call(prompt: str, model: str) -> str:
    """LLM call with LangSmith tracing."""
    # Your LLM call here
    pass
```

## Validation & Testing

### Unit Tests Example

**File**: `tests/unit/test_agents.py`

```python
import pytest
from unittest.mock import AsyncMock, patch

from src.agents.researcher import research, ResearchQuery


@pytest.mark.asyncio
async def test_research_agent():
    """Test research agent with mocked LLM."""

    with patch("src.agents.researcher.research_agent.run") as mock_run:
        # Mock the agent response
        mock_run.return_value.data = {
            "answer": "Test answer",
            "sources": ["https://example.com"],
            "confidence": 0.9,
        }

        query = ResearchQuery(query="What is FastAPI?", max_results=5)
        result = await research(query)

        assert result.answer == "Test answer"
        assert len(result.sources) == 1
        assert result.confidence == 0.9
```

### Integration Tests Example

**File**: `tests/integration/test_api.py`

```python
import pytest
from httpx import AsyncClient

from src.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health/")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "database" in data
        assert "response_time_ms" in data
```

### VCR Testing (Record Real LLM Responses)

**File**: `tests/conftest.py`

```python
import pytest
import vcr

my_vcr = vcr.VCR(
    cassette_library_dir="tests/fixtures/vcr_cassettes",
    record_mode="once",  # Record once, then replay
    match_on=["uri", "method", "body"],
    filter_headers=["authorization"],  # Don't record API keys
)


@pytest.fixture
def vcr_cassette():
    """Fixture for VCR cassette."""
    return my_vcr
```

**File**: `tests/unit/test_llm_with_vcr.py`

```python
import pytest
from src.agents.researcher import research, ResearchQuery


@pytest.mark.vcr
async def test_research_with_real_llm(vcr_cassette):
    """Test with recorded real LLM response."""
    with vcr_cassette.use_cassette("research_fastapi.yaml"):
        query = ResearchQuery(query="What is FastAPI?")
        result = await research(query)

        assert len(result.answer) > 0
        assert result.confidence > 0
```

## Best Practices

### AI/LLM Development

1. **Always Mock in Unit Tests**: Never make real LLM calls in unit tests
2. **Use VCR for Integration Tests**: Record real responses once
3. **Track Costs**: Log token usage and costs for every call
4. **Cache Aggressively**: Cache deterministic LLM responses
5. **Timeout Everything**: Set timeouts on all LLM calls
6. **Validate Outputs**: Use Pydantic to validate LLM responses
7. **Version Prompts**: Track prompt changes in git
8. **Monitor Token Usage**: Set up alerts for unusual usage

### Python/FastAPI

1. **Type Everything**: Use type hints everywhere
2. **Async All The Way**: Use async/await consistently
3. **Dependency Injection**: Use FastAPI's dependency system
4. **Pydantic Models**: Validate all inputs and outputs
5. **Error Handling**: Use custom exceptions and error handlers
6. **Logging**: Structured logging with correlation IDs
7. **Testing**: Aim for >80% coverage

### Database

1. **Async Queries**: Use AsyncSession for all database calls
2. **Connection Pooling**: Configure appropriate pool sizes
3. **Migrations**: Always use Alembic for schema changes
4. **Indexes**: Add indexes for frequently queried columns
5. **Vector Search**: Use pgvector for embedding search

## Deployment Checklist

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add Postgres
railway add postgresql

# Add Redis
railway add redis

# Deploy
railway up

# Set environment variables
railway variables set OPENAI_API_KEY=sk-...

# View logs
railway logs
```

### Fly.io Deployment

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Deploy
flyctl deploy

# Set secrets
flyctl secrets set OPENAI_API_KEY=sk-...

# View logs
flyctl logs
```

## Success Metrics

### Performance

- API latency (p50, p95, p99)
- LLM call latency
- Database query time
- Cache hit rate

### Cost

- Cost per request
- Cost per user
- Monthly LLM spend
- Cost per feature

### Quality

- Test coverage (>80%)
- Type coverage (>95%)
- Error rate (<1%)
- LLM accuracy (track manually)

### Developer Experience

- CI duration (<5 min)
- Local setup time (<15 min)
- Deployment frequency (daily)
- Time to fix bugs (<1 hour)

## Conclusion

This specification provides a complete foundation for building production-ready AI/LLM applications with FastAPI. The key differences from traditional web applications are:

1. **LLM Observability**: Track every LLM call with LangSmith/Langfuse
2. **Cost Tracking**: Monitor token usage and costs
3. **Response Caching**: Cache LLM responses to reduce costs
4. **Streaming**: Support streaming responses for better UX
5. **Type Safety**: Use PydanticAI for type-safe agents
6. **Testing Strategy**: Mock LLMs in unit tests, VCR for integration tests

Follow the phases sequentially, validate each step, and maintain comprehensive documentation as the application evolves.

---

**Specification Version**: 1.0.0
**Last Updated**: 2025-10-31
**Questions?**: Review the troubleshooting section or consult the team
