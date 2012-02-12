/**
 * Copyright (c) 2008 - 2012 by Eric Van Dewoestine
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 *
 * Plugin to interact with firebug.
 *
 * Usage:
 *   :firebug                     opens firebug
 *   :firebug open                opens firebug
 *   :firebug close               closes firebug
 *   :firebug off                 turns firebug off
 *   :firebug toggle              if closed, open firebug, otherwise close it.
 *   :firebug console-focus       places the cursor in the console command line.
 *   :firebug console-clear       clears the console
 *
 * @version 0.4
 */

function FirebugVimperator(){
  return {
    open: function(){
      Firebug.toggleBar(true, 'console');
    },

    off: function() {
      Firebug.closeFirebug(true);
    },

    close: function(){
      Firebug.minimizeBar();
    },

    toggle: function(){
      Firebug.toggleBar();
    },

    console_focus: function(){
      fbv.open();
      var commandLine = Firebug.largeCommandLine
          ? Firebug.chrome.$("fbLargeCommandLine")
          : Firebug.chrome.$("fbCommandLine");
      setTimeout(function(){
        commandLine.select();
      }, 100);
    },

    console_clear: function(){
      Firebug.Console.clear();
    },

    _execute: function(args){
      var name = args.length ? args.shift().replace('-', '_') : 'open';
      var cmd = fbv[name];
      if (!cmd){
        liberator.echoerr('Unsupported firebug command: ' + name);
        return false;
      }
      return cmd(args, args.count > 1 ? args.count : 1);
    },

    _completer: function(context){
      var commands = [];
      for (var name in fbv){
        if (name.indexOf('_') !== 0 && fbv.hasOwnProperty(name)){
          commands.push(name.replace('_', '-'));
        }
      }
      context.completions = [[c, ''] for each (c in commands)];
    }
  };
}

var fbv = new FirebugVimperator();

commands.add(['firebug'],
  'Control firebug from within vimperator.',
  function(args) { fbv._execute(args); },
  { count: true, argCount: '*', completer: fbv._completer }
);
