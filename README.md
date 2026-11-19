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

## Correção desta versão
- Removida a declaração duplicada e antiga de `assessmentMarkup()` que substituía a avaliação atual.
- Mantida a avaliação com 20 afirmações, cinco dimensões e quatro respostas: Concordo, Discordo, Mais ou menos e Não tenho certeza.
- Mantido o cálculo de pontuação de 1 a 3; respostas “Não tenho certeza” não entram na média da dimensão.
- Mantidos os arquivos visuais, a imagem de abertura, a configuração do Supabase e o fluxo de 30 dias.
- `assessment-fix.js` foi preservado no pacote como arquivo legado, mas não é carregado pelo `index.html`.

## Publicação
Envie os arquivos desta pasta para a hospedagem/repositório, substituindo os arquivos antigos somente depois de guardar uma cópia de segurança. Não altere nem recrie as tabelas do Supabase. Depois da publicação, teste o acesso, a avaliação inicial, o salvamento de um dia e a persistência após sair e entrar novamente.
