# SetupMaster

Organize os aplicativos que você quer no Windows e instale-os em sequência com o WinGet. O SetupMaster reúne catálogo, busca, listas personalizadas e acompanhamento da instalação em um aplicativo desktop.

## Tecnologias

- Electron 36 para a aplicação desktop e integração com o Windows.
- Node.js para o processo principal, IPC seguro e execução do WinGet.
- JavaScript, HTML e CSS no renderer da interface.
- Tailwind CSS para o layout, temas e componentes visuais.
- Electron Builder para gerar o instalador NSIS e a versão portable.
- Groq API com Browser Search como busca web opcional.
- Windows Package Manager (`winget`) para instalações nativas.
- Simple Icons, com os créditos e a licença em [licenses/SIMPLE-ICONS-LICENSE.md](licenses/SIMPLE-ICONS-LICENSE.md).

## Instalação

Baixe uma versão na seção **Releases** deste repositório:

- **SetupMaster-<versão>-Setup.exe** instala o aplicativo no Windows e cria atalhos no Menu Iniciar e na Área de Trabalho.
- **SetupMaster-<versão>-Portable.exe** executa sem instalação e pode ser usado em diferentes pastas ou unidades.

O Windows pode exibir um aviso porque o aplicativo não possui assinatura digital. Use os executáveis publicados nas Releases deste projeto.

## Recursos

- Catálogo inicial com aplicativos de jogos, comunicação, utilitários e desenvolvimento.
- Categorias para navegadores, drivers e periféricos, comunicação, entretenimento, launchers de jogos, Adobe, desenvolvimento e utilitários.
- Busca de aplicativos com a Groq e opção de cadastro manual por Winget ID ou link oficial.
- Busca direta no catálogo WinGet local, sem usar a API da Groq.
- Links de suporte que abrem no navegador e hotlinks que baixam o arquivo escolhido.
- Temas Midnight Blue, Grafite, Neon Emerald, Violet Gamer e Crimson Arena.
- Filas e presets para preparar várias instalações de uma vez.
- Verificação de aplicativos já instalados para pulá-los durante a instalação.
- Listas personalizadas que guardam os dados dos aplicativos e podem ser exportadas ou importadas em JSON.
- Acompanhamento do progresso e dos logs do WinGet.
- Exportação de um script `.bat` para instalar os itens selecionados.

## Uso

1. Abra o SetupMaster e adicione aplicativos ao catálogo ou à fila.
2. Para pesquisar um app, configure sua chave Groq em **Preferências** ou preencha os dados manualmente.
3. Escolha **Executar instalação direta** para instalar os itens com Winget ID. Aplicativos que já estão no sistema serão pulados.
4. Para reutilizar uma seleção, crie uma lista personalizada e exporte o JSON. Ao importá-la depois, os aplicativos salvos estarão disponíveis sem nova pesquisa.

Apps adicionados por link abrem a página indicada no navegador; eles não são instalados pelo WinGet. Confira os dados sugeridos pela busca antes de instalar.

## Requisitos

- Windows 10 ou 11 com o WinGet disponível.
- Conexão à internet para buscar e baixar aplicativos.
- Chave da API Groq somente para usar a busca web. A chave é salva no perfil local do aplicativo e não é incluída nos arquivos exportados.

## Licença

O SetupMaster é distribuído sob a licença MIT. Consulte [LICENSE](LICENSE). Os nomes e ícones de marcas de terceiros pertencem a seus respectivos titulares; os ícones Simple Icons incluídos estão sob CC0, conforme [licenses/SIMPLE-ICONS-LICENSE.md](licenses/SIMPLE-ICONS-LICENSE.md).
