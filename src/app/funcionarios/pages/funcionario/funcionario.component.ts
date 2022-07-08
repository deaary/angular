import { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';


@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  formFuncionario: FormGroup = this.fb.group(
    {      
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      foto: ['']    
    }
  )

  funcionario!: Funcionario
  fotoPreview: string = ''
  foto!: File
  desabilitar: boolean = true
  naoEncontrado: boolean = false

  constructor(    
    private fb: FormBuilder,
    private route: ActivatedRoute, // acessar os parametros da rota ativa
    private funcService: FuncionarioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        let idFuncionario = parseInt(params.get('idFuncionario') ?? '0')
        this.recuperarFuncionario(idFuncionario)
      }
    )
  }

  valorMudou(){
    // valueChanges eh uma propriedade dos FormGroups que eh um observable que quando um valor do seu formulario altera, esse observable te retorna essa modificacao
    this.formFuncionario.valueChanges.subscribe(
      // o parametro valores eh um objeto que eh retornado te informando o valor de cada campo do seu reactive forms
      (valores) => {
        // o botao sera desabilitado se as validacoes do formulario estiverem invalidas
        // ou se o valor de algum campo do formulario estiver diferente do valor de aluma 
        // propriedade do objeto funcionario
        this.desabilitar = this.formFuncionario.invalid || !(valores.nome != this.funcionario.nome || valores.email != this.funcionario.email || valores.foto.length > 0)
      }
    )
  }

  

  recuperarFoto(event: any): void {
    this.foto = event.target.files[0]

    const reader =  new FileReader()

    reader.readAsDataURL(this.foto)

    reader.onload = () => {
      this.fotoPreview = reader.result as string
    }

    this.carregarPreview()
  }

  carregarPreview(): void{
    const reader = new FileReader()

    reader.readAsDataURL(this.foto)

    reader.onload = () => {
      this.fotoPreview = reader.result as string
    }
  }

  atualizarFunc(): void {
    const func: Funcionario = this.formFuncionario.value
    func.id = this.funcionario.id
    func.foto = this.funcionario.foto        

    this.funcService.atualizarFuncionario(func).subscribe(
      () => {    
            location.reload()
        this.snackBar.open('Funcionario atualizado com sucesso', 'Ok', {
          duration: 3000
        })
      },
      () => {
        this.snackBar.open('Nao foi possivel atualizar o funcionario', 'Ok',{
          duration: 3000
        })
      }
      )
    
  }

  recuperarFuncionario(id: number): void {
    this.funcService.getFuncionarioById(id).subscribe(
      (func) => {
        // 1- pegar o funcionario que foi retornado e colocar dentro da propriedade funcionario
        this.funcionario = func   
        // 2- pegar os dados do funcionario e atribuir esses valores aos seus respectivos campos no formulario
        // setValue() eh responsavel por pegar os valores que foram passados pra ela e colocar dentro dos formularios
        this.formFuncionario.setValue({nome: this.funcionario.nome, email: this.funcionario.email, foto: ''})
        // 3- carregar o preview da imagem
        this.fotoPreview = this.funcionario.foto  
        this.valorMudou()   
      },
      (erro: HttpErrorResponse) => {
          this.naoEncontrado = erro.status == 404
        }
    )
  }
    
  
}
