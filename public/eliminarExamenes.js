//public/eliminarExamenes.js
/*
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM completamente cargado');
  
    const btnEliminarExamElements = document.querySelectorAll('.btnEliminarExam');
    const orderId = document.getElementById('orderId').value;
  
    btnEliminarExamElements.forEach(button => {
      button.addEventListener('click', async function(event) {
        event.preventDefault();
        const examId = this.getAttribute('data-exam-id');
  
        console.log('Botón de eliminar examen clickeado:', examId);
  
        try {
          const response = await fetch('/order/removeExam', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId: orderId, id: examId })
          });
  
          if (response.ok) {
            console.log('Examen eliminado con éxito');
            // Optionally display a success message or reload the page after a delay
            // location.reload(); // Reload the page (consider user experience)
          } else {
            console.error('Error al eliminar el examen de la orden');
          }
        } catch (error) {
          console.error('Error en la solicitud para eliminar el examen:', error);
        }
      });
    });
  });
  */



// eliminarExamenes.js

document.addEventListener('DOMContentLoaded', function() {
    const btnEliminarExams = document.querySelectorAll('.btnEliminarExam');

    btnEliminarExams.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

            const examId = btn.getAttribute('data-exam-id');
            console.log('Se hizo clic en el examen con ID:', examId);
            // Aquí podrías agregar la lógica para eliminar el examen
        });
    });
});
