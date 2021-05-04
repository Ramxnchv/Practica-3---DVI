Practica 3 - DVI

# Mecanicas implementadas

## Mario en escena

Mario es el personaje que maneja el jugador con los controles de dirección para hacer los movimientos de caminar hacia delante y hacia atras, y saltar, todos estos movimientos con sus correspondientes animaciones.

## Goomba

Los Goombas son enemigos que se mueven horizontalmente hasta chocarse usando aiBounce, al colisionar con mario, este pierde una vida, excepto en el caso de ser golpeado desde arriba que matará el Goomba y saldrá reborado hacia arriba.

## Bloopa

Los Bloopas son enemigos que se mueven verticalmente y que al igual que los Goombas, al colisionar con Mario le quitan una vida excepto en el caso de colisionar en la parte superior del Bloopa, que lo matará y hará que mario rebote hacia arriba.

## Fin del juego al morir

Al quedarse sin vidas Mario se muestra una ventana de Game Over, con la posibilidad de empezar una nueva partida.

## Fin del juego al ganar



## Pantalla de inicio

La pantalla de inicio muestra una imagen que funciona como un botón que al ser pulsado da inicio al nivel 1 del juego.

## Animaciones

Las animaciones añadidas son el movimiento y salto de Mario, el coger las vidas al entrar en contacto con Mario y el movimiento de los enemigos Goombas y Bloopas.

## Monedas

Las monedas, al colisionar con Mario desaparecen e incrementan el contador de monedas y de puntuación que se encuentran en el hud.

## Componente para los enemigos



## Sonidos

Al cargar el primer nivel comienza a reproducirse en bucle la musica del juego, también están añadidas los sonidos producidos al matar enemigos, al coger vidas y monedas y al saltar con Mario.

## Mejoras y ampliaciones

### Vidas

El jugador empieza con 2 vidas, las cuales se incrementarán en el caso de recoger las setas que se encuentran a lo largo del mapa. La partida se acabará cuando se quede sin vidas al colisionar con los enemigos o al caer por los huecos distribuidos por el mapa.

### Puntuación

Cada vez que Mario mate un enemigo, recoja vidas o monedas, sumará unos determinados puntos que se verán reflejados en el hud.
