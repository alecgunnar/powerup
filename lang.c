#include <stdio.h>
#include <stdlib.h>

size_t len = 0;

FILE *input;
char *_char;

void function();
void symbol();

void error(char *msg) {
    puts(msg);
    exit(1);
}

void nextchar () {
    len = fread(_char, sizeof(char), 1, input);

    if (len == 0)
        *_char = 0;
}

int test (char acceptable) {
    return *_char == acceptable;
}

int within (int low, int hi) {
    return *_char >= low && *_char <= hi;
}

int digit() {
    return within(48, 57);
}

int letter () {
    return within(65, 90) || within(97, 122);
}

int take (char expected) {
    if (len == EOF)
        error("Unexpected end of file.");

    if (test(expected)) {
        nextchar();
        return 1;
    }

    char msg[64];
    sprintf(msg, "Unexpected character \"%c\". Expected \"%c\".", *_char, expected);
    error(msg);

    return 0;
}

void whitespace () {
    while (test(' ') || test('\n'))
        nextchar();
}

void name () {
    int length = 0;

    while (letter() && ++length) nextchar();

    if (length == 0)
        error("Expected a function name, but found nothing.");
}

void number () {
    int length = 0;

    while ((digit() || test('.')) && ++length) nextchar();
}

void string () {
    take('"');

    while (test('"') == 0)
        nextchar();

    take('"');
}

void list () {
    take('[');

    symbol();

    while (test(',')) {
        take(',');
        symbol();
    }

    take(']');
}

void symbol () {
    whitespace();

    if (digit()) {
        number();
    } else if (test('"')) {
        string();
    } else if (test('(')) {
        function();
    } else if (test('[')) {
        list();
    } else {
        error("Expected a symbol, but found nothing.");
    }

    whitespace();
}

void argument () {
    symbol();
}

void arguments () {
    if (test(')')) return;

    argument();

    while (test(',')) {
        take(',');
        argument();
    }
}

void function() {
    take('(');

    name();

    if (test(' '))
        arguments();

    take(')');

    whitespace();
}

void program() {
    while (test('('))
        function();
}

int main (int argc, char **argv) {
    input = stdin;

    _char = malloc(sizeof(char));

    nextchar();

    program();

    free(_char);

    return 0;
}