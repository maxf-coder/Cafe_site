# Stage 1: builder
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:0.6.3 /uv /uvx /bin/
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --frozen
COPY . .
ARG SECRET_KEY=dummy-build-key
ENV SECRET_KEY=$SECRET_KEY
RUN uv run python manage.py collectstatic --noinput --clear

# Stage 2: runtime
FROM python:3.12-slim

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --chown=appuser:appgroup --from=builder /app/.venv /app/.venv
COPY --chown=appuser:appgroup --from=builder /app /app
WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8000
CMD ["gunicorn", "cafe_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "--access-logfile", "-"]

ENV HOME=/app
USER appuser