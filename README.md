
---

# INTEGRAÇÃO DOS DADOS DO TERMISTOR COM O API E O REACT

Código Desenvolvido por Lucas Muffato

Esse códio é para os termistores NTC, ou seja, os resistores que diminuem a
resistência elétrica com o aumento da temperatura. Sabendo disso, para se
descobrir a temperatura, basta obter o valor da resistênica elétrica do
termistor no instante da medição.

Lembrando que a variação resistênica/temperatura não é uma taxa linerar, e
sim logarítima. Por isso é necessário utilizar a função que descreve o
comportamento do termistor, além de seus coeficientes específicos, que serão
abordados mais adiante.

O termistor usado foi um Termistor NTC, Modelo TTC 104 da marca TSK.

---

# Como fazer isso funcionar?

## 1 - Converter o sinal recebido na porta analógica do arduino em tensão (volts):

As portas analógicas do arduino, indicam valores de 0 a 1023.
O valor 0 corresponde a 0 volts e o valor 1023 corresponde a 5 volts.

Como a varição de 0 a 1023 é linera, podemos concluir que:
  ```
Vi/Vf = 1023/Pa
  ```
Onde:
  ```
Vi = Tensão inicial 5 volts;\n
Vf = Tensão final aplicada na porta anlógica;\n
Pa = Valor recebido na porta analógica;\n
  ```
Logo, o valor de Vf pode ser obtido por:
  ```
Vf = ( Vi * Pa)/1023
  ```
## 2 - Determinar a Resistênicia do Termistor:

Primeiro é necessário estabelecer o tipo de ligação eletrônica que será usada.

Para proteger o termistor, ele será ligado em série com um resistor de 100k Ohm,
formando um divisor de tensão, conforme o esquema elétrico abaixo:
  ```
  |------T------|
  |             |
  |      |--R---|
  |      |      |
  5v    GND    A0
  ```
Onde:
  ```
5v = Vi = Saída de alimentaçaõ de 5 volts do arduino;
A0 = Pa = Porta analógica número 0; 
T: Termistor (sensor de temperatura);
R: Resistor de 100k Ohm;
GND: Referência de tensão 0;
  ```
⚠️  ATENÇÃO: Como Resistência Nominal do Thermistor é de 100k ohm, recomenda-se
utilizar um resistor de 100k ohm para formar o divisor de tensão. O termo Resistênica Nominal
será explicado mais abaixo.

O interesse nesse passo, é descobrir o valor da resistênica do termistor, e para isso será
usado o valor Vf, encontrado na fórula do Passo 1, e a Lei de Ohm.

A Lei de Ohm afirma o seguinte:
  ```
V = I * R

V = Tensão em volts
I = Corrente elétrica em amperes;
R = Resistência elétrica em Ohms;
  ```
Com isso:
  ```
Rt = Resistência do Termistor;
Rr = Resistênica do Resistor de 100 k ohm;
  ```
Equação 1 - Utilizando o valor da tensão inicial:
  ```
Vi = I * (Rt + Rr)
  ```
logo:
  ```
  I = Vi/(Rt + Rr)
  ```
Equação 2 - Utilizando o valor da tensão final:
  ```
Vf = I * Rr
  ```
logo:
  ```
  I = Vf / Rr
  ```
Unindo as duas equações através da corrente (I):
  ```
Vf/Rr = Vi/(Rt + Rr)
  ```
Logo:
  ```
Rt = (Vi * Rr)/Fv - Rr
  ```
## 3 - Determinado a temperatura do termistor pela Equação do Fator Beta (β)
  ```
1/T = 1/Tn + 1/β * ln(Rt/Rn)
  ```
Onde:
  ```
T = Temperatura medida no termistor, em kelvins;
Tn = Temperatura nominal, que é a temperatura em que o termistor foi calibrado;
β = Coeficiente Beta, é o cofeficinete relacionado a variação de Resistênica/Temperatura;
ln = Logarítimo Natural, ou Log(e), onde a base do logarítimo é a constante de Euler.
Rt = Resistência atual do resistor, em Ohms;
Rn = A resistênica do termistor na temperatura de calibragem;
  ```
Simplificando a equação em função da temperatura (T), temos:
  ```
T = ( β * Tn )/( β + Tn * ln( Rt/Rn ));
  ```
# FLUXO DO CÁLCULO

## 1º Receber o sinal da Porta A0 e converter em Tensão (Vf).
  ```
Vf = ( Vi * Pa)/1023
  ```
## 2º. Aplicar o valor de Vf na fórmula abaixo e obter a resistência do termistor (Rt):
  ```
Rt = (Vi * Rr)/Fv - Rr
  ```
## 3º Aplicar o valor de Rt na fórmula abaixo, e consultar os coeficientes na documentação do termistor:
  ```
T = ( β * Tn )/( β + Tn * ln( Rt/Rn ));
  ```
A documentação do Termistor está no link:
https://datasheetspdf.com/pdf-file/768616/TKS/TTC-104/1

![image](./arduino-code/NTC-104-coeficientes.jpg)
  ```
Tn = 25 graus Celsius (°C);
Rn = 100k Ohms;
β = 4400;
  ```
⚠️  IMPORTANTE:
* Como o valor de `Tn` foi informado na documentação esté em `graus Celsius`, é necessário converte-lo na `escala kelvin`, somando 273.15.
* Como a equação resulta na temperatura (`T`) na `escla kelvin`, para converte-la em `graus Celsius`, basta subtrair 273.15.

Logo a equação final fica:
  ```
T = ( β * Tn + 273.15 )/( β + (Tn + 273.15 ) * ln( Rt/Rn )) - 273.15;
  ```

# ESQUEMA DE PINOS DO DISPLAY

No projeto, foi utilizado um displau de LCD 16x2 para verificar o temperatura sem a
necessidade de ligar o arduino no computador, porém o display não é necessário para se obter os dados e utiliza-los onde for.

Mesmo assim, caso esteja interessado em utilizar o display, aqui está o esquema dos pinos
ligados nas porta do Arduino.

  ```
DYSPLAY |  VSS | VVD | V0 | RS | RW | E | D0 | D1 | D2 | D3 | D4 | D5 | D6 | D7 | A | K |
ARDUINO |  GND | 5v  | Pt | D7 | GND| D6|    |    |    |    | D5 | D4 | D3 | D2 | 5v|GND|           
  ```

O pino Pt do Display é ligado em um potenciômetro, para controlar o contraste da tela.
A ligação do potenciômetro é feita conforme a ligação abaixo:

  ```
  |--Potenciômetro--|
  |        |        |
  |        |        |
  |        |        |
  5v       Pt      GND
  ```
O potenciômetro utilizado foi de `10K ohms`.

# Levando os dados do arduino para a API