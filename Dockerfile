# Docker descriptor for codbex-hermes
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-atlas:0.36.0

COPY codbex-hermes target/dirigible/repository/root/registry/public/codbex-hermes
COPY . target/dirigible/repository/root/users/admin/workspace

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-hermes/index.html
