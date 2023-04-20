const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const flujoMultimedia = addKeyword(['informacion','información','paysup'])
   .addAnswer("te envio audio",{ 
    media: "https://emprendeconmoises.paysupgo.com/wp-content/uploads/2023/04/el-metodo-f3-mp3-1.mp3" 

  })

  .addAnswer("¿Quieres conocer cómo puedes cambiar tu vida?",{ 
    media: "https://emprendeconmoises.paysupgo.com/wp-content/uploads/2023/04/170.jpg" 

  });  


 
  const flowString = addKeyword('como').addAnswer('seleciona cada boton para continuar', {
    buttons: [{ body: 'informacion' }, { body: 'registro' }, { body: 'Boton acceder ahora' },],
})

const flowPrincipal = addKeyword(['registro', 'alo'])
.addAnswer(['Hola, aqui puedes registrarte https://sys.paysupgo.com/ ', '¿Que ofrecemos?'])
.addAnswer(['Tenemos:', 'Robot', 'web', 'etc ...'])   

let nombre;
let apellidos;
let telefono;

const flowFormulario = addKeyword(['paysup','⬅ Volver al Inicio'])
    .addAnswer(
        ['Hola!','Para  Para asegurarte de recibir información detallada...' ,'agrégame a tus contactos cual es tu nombre*'],
        { capture: true, buttons: [{ body: '❌ iniciar' }] }, 
     
       

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ informacion')
             return endFlow({body: '❌ ya has sido agendado ❌',   
           buttons:[{body:'⬅ acceder ahora' }] 

            
            })
            nombre = ctx.body
            return flowDynamic(`Encantado *${nombre}*, continuamos...`)
        }
    )
    .addAnswer(
       ['¡Comencemos a ganar juntos con Paysup! 💰👍'],
       { capture: true, buttons: [{ body: '❌ si' }] },

       async (ctx, { flowDynamic, endFlow }) => {
           if (ctx.body == '❌ iniciar') 
               return endFlow({body: '❌ registro ❌',
                   buttons:[{body:'⬅ Volver al Inicio' }]


        })
        apellidos = ctx.body
        return flowDynamic(`Perfecto *${nombre}*, por último...`)
        }
    )
    .addAnswer(
        ['entra ya a ver el video en este enlace: https://emprendeconmoises.paysupgo.com/. Te aseguro que no te arrepentirás. 🤩.'],
        { capture: true, buttons: [{ body: '❌ acceder ahora' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ acceder ahora') 
                return endFlow({body: '❌ ¿Quieres conocer cómo puedes cambiar tu vida?  ❌',
                      buttons:[{body:'⬅ Volver al Inicio' }]
                })


                telefono = ctx.body
                await delay(2000)
                return flowDynamic(`Estupendo *${nombre}*! ¿Te cuento más? 💰

                \n- Nombre y apellidos: ${nombre} ${apellidos}
                \n- Telefono: *${telefono}*`)
        }
    )


   

const main = async () => {
    const adapterDB = new MockAdapter() 
    const adapterFlow = createFlow([flowString,flujoMultimedia,flowPrincipal,flowFormulario])
    const adapterProvider = createProvider(BaileysProvider)   

    
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
