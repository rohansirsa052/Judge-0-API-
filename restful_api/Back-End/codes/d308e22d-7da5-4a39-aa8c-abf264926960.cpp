#include<iostream.h>
#include<conio.h>
void main()
{
int simple_interest,principal,rate,time;
cout<<"Enter principal";
cin>>principal;
cout<<"Enter rate";
cin>>rate;
cout<<"Enter time";
cin>>time;
simple_interest=(principal*rate*time)/100;
cout<<"Simple Interest is:="<<simple_interest;
getch();
}