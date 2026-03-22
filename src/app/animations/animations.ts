import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  query,
  stagger,
  group,
  animateChild
} from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)', height: 0 }))
  ])
]);

export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-50px)' }),
    animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
  ])
]);

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(50px)' }),
    animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(50px)' }))
  ])
]);

export const slideInUp = trigger('slideInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50px)' }),
    animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(50px)' }))
  ])
]);

export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
      style({ opacity: 0, transform: 'scale(0.3)', offset: 0 }),
      style({ opacity: 1, transform: 'scale(1.05)', offset: 0.5 }),
      style({ opacity: 1, transform: 'scale(0.9)', offset: 0.7 }),
      style({ opacity: 1, transform: 'scale(1)', offset: 1 })
    ]))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
  ])
]);

export const rotateIn = trigger('rotateIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotate(-180deg) scale(0.5)' }),
    animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'rotate(0) scale(1)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'rotate(180deg) scale(0.5)' }))
  ])
]);

export const flipIn = trigger('flipIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)' }),
    animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'perspective(400px) rotateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'perspective(400px) rotateX(-90deg)' }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true }),
    query(':leave', [
      stagger(50, [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ], { optional: true })
  ])
]);

export const pulse = trigger('pulse', [
  state('normal', style({ transform: 'scale(1)' })),
  state('pulsing', style({ transform: 'scale(1.1)' })),
  transition('normal => pulsing', [
    animate('200ms ease-out')
  ]),
  transition('pulsing => normal', [
    animate('200ms ease-in')
  ])
]);

export const shake = trigger('shake', [
  transition(':enter', [
    animate('500ms ease-in-out', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.2 }),
      style({ transform: 'translateX(10px)', offset: 0.4 }),
      style({ transform: 'translateX(-10px)', offset: 0.6 }),
      style({ transform: 'translateX(10px)', offset: 0.8 }),
      style({ transform: 'translateX(0)', offset: 1 })
    ]))
  ])
]);

export const glow = trigger('glow', [
  state('normal', style({ boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' })),
  state('active', style({ boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4)' })),
  transition('normal => active', animate('300ms ease-out')),
  transition('active => normal', animate('300ms ease-in'))
]);

export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: 0, opacity: 0, overflow: 'hidden' })),
  state('expanded', style({ height: '*', opacity: 1 })),
  transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
]);

export const colorChange = trigger('colorChange', [
  transition('* => *', [
    animate('400ms ease-in-out')
  ])
]);
