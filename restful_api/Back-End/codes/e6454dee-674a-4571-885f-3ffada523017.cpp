/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <stdio.h>

int main()
{
 float sim_interst;
 int prin_ammount, rate, time;
 
 printf("enter prin_ammount, rate and time \n");
 scanf("%d%d%d", &prin_ammount, &rate, &time);
 sim_interst= prin_ammount*rate*time/100;
 printf("sim_interst is %f", sim_interst);
    return 0;
}

