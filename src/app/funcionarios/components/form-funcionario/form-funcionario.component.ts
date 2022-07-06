import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-form-funcionario',
  templateUrl: './form-funcionario.component.html',
  styleUrls: ['./form-funcionario.component.css']
})
export class FormFuncionarioComponent implements OnInit {

  formFuncionario: FormGroup = this.fb.group(
    {
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]] ,
      foto: ['']     
    }
  )

  foto!: File
  fotoPreview: string = ''
  salvandoFuncionario: boolean = false

  constructor(
    private fb: FormBuilder,
    private funcService: FuncionarioService,
    private dialogRef: MatDialogRef<FormFuncionarioComponent>, // objeto que permite controlar o dialog aberto
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  recuperarFoto(event: any): void {
    this.foto = event.target.files[0]
    this.carregarPreview()
  }

  carregarPreview(): void{
    const reader = new FileReader()

    reader.readAsDataURL(this.foto)

    reader.onload = () => {
      this.fotoPreview = reader.result as string
    }
  }

  salvar(): void {
    this.salvandoFuncionario = true
    const f: Funcionario = this.formFuncionario.value
    f.foto = ''
    let obsSalvar: Observable<any>

    if (this.formFuncionario.value.foto.length != undefined) {
      obsSalvar = this.funcService.salvarFuncionario(f, this.foto)
    } else {
      obsSalvar = this.funcService.salvarFuncionario(f)
    }

    obsSalvar.subscribe(
      (resultado) => {
        // 1- testar se o resultado eh uma promise ou nao
        if(resultado instanceof Promise) {
          // se cair no if, significa que ha uma promise 
          resultado.then((obs$) => {
            obs$.subscribe(
              () => {
                this.snackBar.open('Funcionario salvo com sucesso', 'Ok', {
                  duration: 3000
                })
                this.dialogRef.close()
              }
            )
          })
        } else {
          // se cair no else, significa que o funcionario ja foi salvo
          // e nao tinha foto para enviar
          this.snackBar.open('Funcionario salvo com sucesso', 'Ok', {
            duration: 3000
          })
          this.dialogRef.close()
        }
      }
    )
  }
    /* this.funcService.salvarFuncionario(f, this.foto).subscribe(
      async (dados) => {
        //1- recuperar o observable que me é retornado do primeiro subscribe
        
        // a funcao then() é executada quando a promise consegue te retornar os dados com sucesso
        //nesse caso, o dado que sera retornado eh um observable com o funcionario que foi salvo no banco de dados
        dados.then((obs$) => {
          //se inscrevendo-se no observable que nos retornara o funcionario salvo no banco de dados
          obs$.subscribe(
            (func) => {
              // quando o funcionario for salvo, aparecera um alert na tela e o dialog sera fechado
              this.snackBar.open('Funcionario salvo com sucesso', 'Ok', {
                duration: 3000
              })
              this.dialogRef.close()
            }
          )
        })
      }
    ) */
      
    
  

}
