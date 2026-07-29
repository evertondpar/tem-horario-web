# Tem Horário - Frontend MVP

## 1. Login 🔐

Objetivo:
Permitir que o estabelecimento acesse o sistema.

Campos:
- [ ] Telefone
- [ ] Senha

Funcionalidades:
- [ ] Validação dos campos
- [ ] Login via API
- [ ] Salvar JWT
- [ ] Redirecionar para Dashboard
- [ ] Logout
- [ ] Rotas protegidas

---

## 2. Layout 🖥️

Objetivo:
Criar a estrutura base da aplicação.

Componentes:
- [ ] Sidebar
- [ ] Header
- [ ] Área de conteúdo
- [ ] Avatar do estabelecimento
- [ ] Botão de Logout

Menu:
- Dashboard
- Serviços
- Colaboradores
- Agenda
- Agendamentos
- Configurações

---

## 3. Dashboard 📊

Objetivo:
Exibir um resumo da operação.

Cards:
- [ ] Agendamentos de hoje
- [ ] Próximo atendimento
- [ ] Total de colaboradores
- [ ] Total de serviços

Lista:
- [ ] Próximos agendamentos

---

## 4. Serviços 💈

Objetivo:
Cadastrar os serviços oferecidos.

Tabela:
- [ ] Nome
- [ ] Duração
- [ ] Preço
- [ ] Ações

Criar serviço

Campos:
- [ ] Nome
- [ ] Duração (minutos)
- [ ] Preço

Editar serviço

Excluir serviço

---

## 5. Colaboradores 👨‍💼

Objetivo:
Cadastrar barbeiros/colaboradores.

Tabela:
- [ ] Nome
- [ ] Telefone
- [ ] Status
- [ ] Ações

Criar colaborador

Campos:
- [ ] Nome
- [ ] Telefone
- [ ] Senha
- [ ] Foto (opcional)

Editar colaborador

Excluir colaborador

---

## 6. Serviços do Colaborador ✂️

Objetivo:
Definir quais serviços cada colaborador realiza.

Tela:

Nome do colaborador

Lista:

- [ ] Corte
- [ ] Barba
- [ ] Corte + Barba
- [ ] etc...

Botão:
- Salvar

---

## 7. Agenda 📅

Objetivo:
Configurar disponibilidade semanal do colaborador.

Selecionar:
- [ ] Colaborador

Dias:
- Segunda
- Terça
- Quarta
- Quinta
- Sexta
- Sábado
- Domingo

Cada dia possui:

- [ ] Data
- [ ] Slots de 30 em 30 minutos

Status:

- Disponível
- Indisponível
- Ocupado (somente leitura)

Botão:
- Salvar Agenda

---

## 8. Agendamentos 📆

Objetivo:
Gerenciar todos os atendimentos.

Tabela:

- Cliente
- Telefone
- Serviço
- Colaborador
- Data
- Hora
- Status

Filtros:

- [ ] Data
- [ ] Colaborador
- [ ] Status

---

### Novo Agendamento

Campos:

- [ ] Colaborador
- [ ] Serviço
- [ ] Nome do cliente
- [ ] Telefone
- [ ] Data
- [ ] Horário

Botão:

- Criar Agendamento

---

### Ações

Cada agendamento poderá:

- [ ] Confirmar
- [ ] Recusar
- [ ] Cancelar
- [ ] Concluir

---

## 9. Configurações ⚙️

Dados da barbearia

Campos:

- [ ] Nome
- [ ] Telefone
- [ ] Endereço
- [ ] Foto

Botão:

- Salvar

---

# Melhorias futuras 🚀

Clientes

- Cadastro de clientes
- Histórico
- Observações

Agenda

- Arrastar horários
- Calendário mensal
- Bloqueio de férias

Notificações

- WhatsApp
- E-mail

Dashboard

- Faturamento
- Serviços mais vendidos
- Clientes recorrentes

Sistema

- Tema escuro
- Perfil do colaborador
- Permissões
- Multi-estabelecimento