# Página de bio · Dr. Lucas Melo

HTML, CSS e JS puros. Sem framework, sem bundler, sem build step.

**No ar em <https://drlucasmelo.lucas-f50.workers.dev>**, servido pela Cloudflare
como Worker com assets estáticos, ligado ao repositório
<https://github.com/Lucasmp86/drlucasmelo>. Cada push na branch `main` republica
sozinho, em cerca de um minuto. Não há build: a Cloudflare copia a pasta como ela
está, e o arquivo `_headers` define cache e cabeçalhos de segurança.

Se um dia houver domínio próprio, ele aponta para esse mesmo Worker e as duas
únicas linhas a trocar são o `canonical` e o `og:image`, no topo do index.html.

## Onde mexer

**Todo texto e todo link estão no `index.html`.** Abra o arquivo, procure a frase,
troque, salve. Não há outro lugar para procurar.

Os links aparecem escritos por extenso, inclusive a mensagem que já vem digitada
no WhatsApp de cada card. Para mudar a mensagem do card de lipedema, por exemplo,
troque o texto depois de `?text=` naquele link. Espaço vira `%20` e acento vira
código (`á` = `%C3%A1`); se ficar em dúvida, escreva sem acento.

Trocar o card IV por "Remodelamento corporal" é editar aquele bloco `<li>`:
o título, a linha de apoio e o texto do WhatsApp.

## Estrutura

    index.html          a página inteira: texto, links, marcação
    assets/style.css    só forma. Cores e fontes ficam no topo, em :root
    assets/app.js       três comportamentos: entrada dos blocos e a barra fixa
    assets/fonts/       as fontes, servidas do próprio domínio
    assets/img/         a foto do hero em AVIF, WebP e JPG, em três larguras
    _headers            cache e cabeçalhos de segurança, lidos pelo Cloudflare
    _source/            originais e scripts. NÃO vai para o ar (veja .gitignore)

## Refazer os assets

Precisa do ambiente Python local (`.venv`), criado uma vez:

    python3 -m venv .venv && ./.venv/bin/pip install fonttools brotli pillow

Foto do hero (corta em 4:5, remove EXIF, gera os nove arquivos):

    ./.venv/bin/python _source/build-hero.py _source/hero-original.jpg

Fontes (reduz cada fonte às letras que a página usa):

    ./.venv/bin/python _source/build-fonts.py

## Ver no computador antes de publicar

    python3 -m http.server 8000

Depois abra <http://localhost:8000> no navegador.

## O que a página não faz

Nenhum analytics, pixel, cookie ou tag externa. Nenhuma requisição sai do
domínio. Por isso também não existe banner de consentimento.

A medição vem dos próprios links: UTM nos links de saída e uma mensagem
diferente pré-digitada no WhatsApp de cada card, para o contato já chegar
sabendo de qual assunto veio.
