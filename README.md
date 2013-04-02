# Chatbot Demo
A demonstration of a very rudimentary chatbot --- Actually, there's no AI yet, so it's not much of a bot at the moment.

Live demo: http://chatbot.rexmac.com

The server uses [NodeJS](http://nodejs.org/), [Socket.IO](http://socket.io/), and [Socket.IO-sessions](https://github.com/aviddiviner/Socket.IO-sessions).

The client uses [Bootstrap](http://twitter.github.com/bootstrap/), [H5BP](http://html5boilerplate.com/), and [jQuery CSSEmoticons](http://os.alfajango.com/css-emoticons/).

This project is several years old. I recently (29-03-13) updated it to use [Grunt](http://gruntjs.com/) and to ensure it still (somewhat) works. This is one of many projects that I hope to experiment with more in the future if I ever find the time.

## Installation

1. Clone this repository.
2. Run `npm install && bower install`.
3. Run `grunt`.
4. Start the server: `npm start`
5. Navigate to `http://127.0.0.1:1337` in your browser.

## Usage

Type messages in the input box and receive a response. It really is that simple. Even more so, since there is no AI yet so the server only has one response. Unless you type in one of the commands described below.

### Commands

The following commands may be entered to generate different effects. Each command must be preceeded with a forward slash character, e.g., `/help`.

The last 50 commands are stored for reuse. The <UP> and <DOWN> arrow keys can be used to navigate the command history.

#### <code>/help [<em>command</em>]</code>
Displays generic help text. If provided a _command_ argument, displays help about that command.

#### <code>/flip</code>
Flips a coin and displays the result.

#### <code>/fortune</code>
Displays a "fortune" from the [`fortune`](http://en.wikipedia.org/wiki/Fortune_%28Unix%29) program.

#### <code>/image <em>query</em></code>
Displays the first result from a Google Images search for the given _query_.

#### <code>/roll [<em>size</em>]</code>
Rolls a _size_-sided die and displays the result. The default _size_ is 6.

## Credits and Inspiration

I wrote this a few years ago and most of my notes and documentation from the time are now lost. I'm sure I found inspiration and borrowed code from other open-source demonstrations circa 2011. If you recognize any code or techniques used here, and you had them online in mid to late 2011, please let me know so that I can give you proper credit.

## Licence (MIT)

Copyright (c) 2011 Rex McConnell (http://rexmac.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
