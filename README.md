# Caderno do Eu — ELA EM EXPANSÃO

Aplicação web responsiva de jornada de autoconhecimento de 30 dias.

## Arquivos
- `index.html`: estrutura da aplicação
- `style.css`: identidade visual
- `app.js`: autenticação e integração Supabase
- `manifest.json`: configuração básica para instalação como PWA

## Configuração
O projeto usa o Supabase separado `tqnzepzfxqwqwtqpprem`. A chave publishable/anon no frontend é própria para uso público e as tabelas usam Row Level Security. Nunca coloque service_role/secret keys no frontend.

## Importante antes de atender pacientes
1. Criar o usuário administrador no Supabase Auth.
2. Definir `app_metadata.role = "admin"` no usuário administrador (não usar user_metadata).
3. Inserir o perfil correspondente em `public.caderno_profiles` com role `admin`.
4. Criar cada participante no Supabase Auth e inserir o perfil com role `participant`.
5. Configurar convite/recuperação de senha e consentimento informado.
6. Revisar a política de privacidade e testar contas distintas antes de uso real.

O painel administrativo depende da claim segura `app_metadata.role = admin`, conforme as políticas RLS do banco.
