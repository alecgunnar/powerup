#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int findnewline (char *buffer, int bufflen) {
    for (int i = 0; i < bufflen; i++)
        if (buffer[i] == '\n')
            return i + 1;

    return -1;
}

int nextline (char **loc, FILE *from) {
    int bufflen = 64;
    char buffer[bufflen];
    int readlen;
    int takelen = 0;
    int linelen = -1;

    long pos = ftell(from);

    while ((readlen = fread(buffer, sizeof(char), bufflen, from)) > 0) {
        int eol = findnewline(buffer, readlen);

        if (eol != -1) {
            linelen += takelen + eol;
            break;
        }

        takelen += readlen;
    }

    if (linelen == - 1)
        return -1;

    fseek(from, pos, SEEK_SET);
    *loc = calloc(linelen, sizeof(char));
    fread(*loc, sizeof(char), linelen, from);
    fseek(from, 1, SEEK_CUR);

    return linelen;
}

char lc (char ltr) {
    return ltr > 90 ? ltr - 32 : ltr;
}

int cmp (char a, char b) {
    a = lc(a);
    b = lc(b);

    return a > b;
}

int lgr (char *larger, char *than) {
    int alen = strlen(larger);
    int blen = strlen(than);

    int len = alen > blen ? blen : alen;

    for (int i = 0; i < len; i++)
        if (larger[i] != than[i])
            return cmp(larger[i], than[i]);

    return 0;
}

void swap (char **lines, int a, int b) {
    char *hold = lines[a];
    lines[a] = lines[b];
    lines[b] = hold;
}

int main (int argc, char **argv) {
    int len;
    int cnt = 0;
    char *line;
    char **lines = malloc(sizeof(char *) * 16);

    while ((len = nextline(&line, stdin)) != -1)
        lines[cnt++] = line;

    for (int rnd = 0; rnd < cnt; rnd++)
        for (int idx = 1; idx < cnt - rnd; idx++)
            if (lgr(lines[idx-1], lines[idx]))
                swap(lines, idx, idx - 1);

    for (int i = 0; i < cnt; i++) {
        puts(lines[i]);
        free(lines[i]);
    }
}
